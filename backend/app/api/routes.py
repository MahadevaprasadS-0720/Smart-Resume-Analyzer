import os
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.models.schemas import (
    ResumeAnalysisResponse,
    ResumeMetadata,
    ScoreBreakdown,
    MatchedKeywordsDetail,
    SkillGroupDetail,
    ExperienceFitDetail,
    AtsSuggestionItem,
    HealthCheckResponse,
    BulletRewriteRequest,
    BulletRewriteResponse,
    CoverLetterRequest,
    CoverLetterResponse,
    InterviewPrepRequest,
    InterviewPrepResponse,
    AtsHealthAuditResult,
    AtsAuditIssueItem,
)
from app.services.parser import parse_resume
from app.services.nlp_analyzer import analyze_resume_nlp
from app.services.suggestions import generate_actionable_suggestions, detect_resume_sections
from app.services.bullet_rewriter import generate_xyz_bullet_variations
from app.services.cover_letter import generate_cover_letter_service
from app.services.interview_prep import generate_interview_prep_service
from app.services.ats_audit import audit_resume_ats_health
from app.utils.text_cleaner import extract_emails, extract_phone_numbers, extract_links
from app.utils.file_helpers import validate_file_extension
from app.core.config import settings

api_router = APIRouter()


@api_router.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def check_health():
    """
    Health check endpoint.
    """
    return HealthCheckResponse(
        status="healthy",
        version=settings.VERSION,
        service=settings.PROJECT_NAME,
        cors_origins=settings.CORS_ORIGINS,
    )


@api_router.post("/analyze", response_model=ResumeAnalysisResponse, tags=["Resume Analyzer"])
async def analyze_resume_endpoint(
    file: Optional[UploadFile] = File(None, description="Uploaded PDF, DOCX, or TXT resume file"),
    resume_text: Optional[str] = Form(None, description="Optional raw resume text if no file uploaded"),
    job_description: str = Form(..., description="Target Job Description text to evaluate against"),
    target_role: Optional[str] = Form(None, description="Optional target position or role title"),
):
    """
    Core resume analysis endpoint.
    Accepts resume file (PDF/DOCX) or plain text, parses contents, executes NLP & ATS scoring,
    and returns comprehensive match metrics, keyword counts, experience fit, and suggestions.
    """
    if not job_description or not job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description text is required for analysis.",
        )

    parsed_filename = "Direct Input"
    extracted_text = ""
    page_count = 1
    word_count = 0
    char_count = 0

    # 1. Parse from file if provided
    if file and file.filename:
        is_valid, err_msg = validate_file_extension(file.filename)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=err_msg,
            )

        try:
            file_bytes = await file.read()
            if not file_bytes:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The uploaded resume file is empty.",
                )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to read uploaded file: {str(e)}",
            )

        try:
            parse_result = parse_resume(file_bytes, file.filename)
            extracted_text = parse_result["text"]
            parsed_filename = file.filename
            page_count = parse_result["page_count"]
            word_count = parse_result["word_count"]
            char_count = parse_result["character_count"]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Failed to parse resume document: {str(e)}",
            )

    # 2. Or parse from direct text
    elif resume_text and resume_text.strip():
        extracted_text = resume_text.strip()
        words = extracted_text.split()
        word_count = len(words)
        char_count = len(extracted_text)
        page_count = max(1, (word_count + 399) // 400)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either a resume file (PDF/DOCX) or paste resume text.",
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No readable text could be extracted from the provided resume.",
        )

    # 3. Extract Metadata & Contact Info
    metadata = ResumeMetadata(
        filename=parsed_filename,
        word_count=word_count,
        character_count=char_count,
        page_count=page_count,
        detected_emails=extract_emails(extracted_text),
        detected_phones=extract_phone_numbers(extracted_text),
        detected_links=extract_links(extracted_text),
    )

    # 4. Execute Core NLP Matching & Scoring
    nlp_results = analyze_resume_nlp(extracted_text, job_description)

    # 5. Detect Structure & Generate Suggestions
    sections = detect_resume_sections(extracted_text)
    raw_suggestions = generate_actionable_suggestions(
        nlp_results=nlp_results,
        resume_text=extracted_text,
        word_count=word_count,
        page_count=page_count,
    )
    suggestions = [AtsSuggestionItem(**s) for s in raw_suggestions]

    # 6. Run In-Depth ATS Formatting & Health Audit
    raw_audit = audit_resume_ats_health(extracted_text)
    ats_health_audit_res = AtsHealthAuditResult(**raw_audit)

    # 7. Format Verdict
    ats_score = nlp_results["overall_ats_score"]
    if ats_score >= 80:
        verdict = "Excellent Match! Your resume demonstrates strong alignment with target job requirements."
    elif ats_score >= 60:
        verdict = "Moderate Match. Adding the missing highlighted keywords will notably increase ATS visibility."
    else:
        verdict = "Low Alignment. Tailor your skills, keywords, and achievements closer to the job description."

    # Section & formatting composite sub-scores
    active_sections = sum(1 for v in sections.values() if v)
    sections_score = round((active_sections / max(1, len(sections))) * 100.0, 1)
    formatting_score = float(ats_health_audit_res.health_score)

    scores_breakdown = ScoreBreakdown(
        keyword_match=nlp_results["similarity_score"],
        skills_match=nlp_results["skills_coverage_score"],
        formatting_score=formatting_score,
        sections_score=sections_score,
        overall_score=ats_score,
    )

    return ResumeAnalysisResponse(
        success=True,
        ats_score=ats_score,
        similarity_score=nlp_results["similarity_score"],
        skills_score=nlp_results["skills_coverage_score"],
        matched_keywords=MatchedKeywordsDetail(**nlp_results["matched_keywords"]),
        technical_skills=SkillGroupDetail(**nlp_results["technical_skills"]),
        soft_skills=SkillGroupDetail(**nlp_results["soft_skills"]),
        missing_critical_skills=nlp_results["missing_critical_skills"],
        experience_fit=ExperienceFitDetail(**nlp_results["experience_fit"]),
        sections_detected=sections,
        suggestions=suggestions,
        metadata=metadata,
        summary_verdict=verdict,
        scores=scores_breakdown,
        ats_health_audit=ats_health_audit_res,
    )



@api_router.post("/rewrite-bullets", response_model=BulletRewriteResponse, tags=["AI Bullet Rewriter"])
async def rewrite_bullet_endpoint(payload: BulletRewriteRequest):
    """
    AI Bullet Point Rewriter Endpoint.
    Accepts raw/weak bullet point and optional target role,
    applies Google's XYZ formula and action verb enhancement,
    and returns 3 high-impact variations with action verbs.
    """
    if not payload.bullet or not payload.bullet.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A non-empty bullet point string is required to rewrite.",
        )

    result = generate_xyz_bullet_variations(
        raw_bullet=payload.bullet.strip(),
        target_role=payload.target_role.strip() if payload.target_role else None,
    )

    return BulletRewriteResponse(**result)


@api_router.post("/generate-cover-letter", response_model=CoverLetterResponse, tags=["AI Cover Letter Generator"])
async def generate_cover_letter_endpoint(payload: CoverLetterRequest):
    """
    AI Cover Letter Generator Endpoint.
    Generates a tailored, role-specific cover letter mapped directly to target job requirements.
    Supports 'Professional', 'Enthusiastic', and 'Concise' tones.
    """
    if not payload.job_description or not payload.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A target job description is required to generate a tailored cover letter.",
        )

    result = generate_cover_letter_service(
        candidate_name=payload.candidate_name,
        target_role=payload.target_role,
        skills=payload.skills,
        experience_summary=payload.experience_summary,
        job_description=payload.job_description,
        tone=payload.tone or "Professional",
        resume_text=payload.resume_text,
    )

    return CoverLetterResponse(**result)


@api_router.post("/interview-prep", response_model=InterviewPrepResponse, tags=["AI Mock Interview Prep"])
async def interview_prep_endpoint(payload: InterviewPrepRequest):
    """
    AI Mock Interview Prep Endpoint.
    Generates 6 role-tailored interview questions mapped to ATS gap analysis
    (3 Technical Gap questions, 2 Scenario/System Design questions, 1 Behavioral question),
    along with Interviewer Intent, STAR Framework outlines, and keywords.
    """
    result = generate_interview_prep_service(
        matched_skills=payload.matched_skills,
        missing_skills=payload.missing_skills,
        target_role=payload.target_role,
        seniority_level=payload.seniority_level,
        job_description=payload.job_description,
        resume_text=payload.resume_text,
    )

    return InterviewPrepResponse(**result)


@api_router.post("/audit-resume", response_model=AtsHealthAuditResult, tags=["ATS Health Audit"])
async def audit_resume_endpoint(resume_text: str = Form(...)):
    """
    ATS Formatting & Health Audit Endpoint.
    Performs contact details, section headings, and layout anomaly analysis,
    calculating an ATS Health Score (0-100%) and providing structured fix suggestions.
    """
    if not resume_text or not resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is required to execute ATS formatting audit.",
        )

    result = audit_resume_ats_health(resume_text)
    return AtsHealthAuditResult(**result)




