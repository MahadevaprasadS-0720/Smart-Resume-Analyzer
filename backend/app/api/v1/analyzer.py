from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.models.schemas import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    ResumeMetadata,
)
from app.services.parser_service import parse_resume_file
from app.services.ats_service import calculate_ats_score, generate_ats_suggestions
from app.services.nlp_service import SKILL_TAXONOMY, extract_skills
from app.utils.file_helpers import validate_file_extension
from app.utils.text_cleaner import extract_emails, extract_phone_numbers, extract_links

router = APIRouter(prefix="/analyze", tags=["Resume Analyzer"])


@router.post("/file", response_model=ResumeAnalysisResponse)
async def analyze_resume_file(
    file: UploadFile = File(..., description="Resume file in PDF or DOCX format"),
    job_description: str = Form(..., description="Target Job Description text"),
    target_role: Optional[str] = Form(None, description="Optional target job title or role"),
):
    """
    Parses an uploaded resume file (PDF/DOCX) and analyzes it against the job description.
    """
    # 1. Validate file extension
    is_valid, err_msg = validate_file_extension(file.filename)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg,
        )

    # 2. Read file contents
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is empty.",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read uploaded file: {str(e)}",
        )

    # 3. Parse resume text
    try:
        parsed_data = parse_resume_file(file_bytes, file.filename)
        resume_text = parsed_data["text"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not extract text from {file.filename}: {str(e)}",
        )

    if not resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from the file. Ensure the PDF/DOCX is not a scanned image.",
        )

    # 4. Extract contact & metadata
    emails = extract_emails(resume_text)
    phones = extract_phone_numbers(resume_text)
    links = extract_links(resume_text)

    metadata = ResumeMetadata(
        filename=file.filename,
        word_count=parsed_data["word_count"],
        character_count=parsed_data["character_count"],
        page_count=parsed_data["page_count"],
        detected_emails=emails,
        detected_phones=phones,
        detected_links=links,
    )

    # 5. Calculate ATS scores & breakdown
    breakdown, sections, matched_skills, missing_skills = calculate_ats_score(
        resume_text=resume_text,
        job_description=job_description,
        word_count=parsed_data["word_count"],
        page_count=parsed_data["page_count"],
    )

    # 6. Generate actionable suggestions
    suggestions = generate_ats_suggestions(
        breakdown=breakdown,
        sections=sections,
        missing_skills=missing_skills,
        word_count=parsed_data["word_count"],
    )

    # 7. Summary verdict text
    if breakdown.overall_score >= 80:
        verdict = "Excellent Match! Your resume is highly optimized for this job description."
    elif breakdown.overall_score >= 60:
        verdict = "Good Foundation. A few targeted keyword additions will significantly improve your match."
    else:
        verdict = "Needs Optimization. Tailor your skills and keywords closely to the target job description."

    return ResumeAnalysisResponse(
        success=True,
        metadata=metadata,
        scores=breakdown,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        detected_sections=sections,
        suggestions=suggestions,
        summary_verdict=verdict,
    )


@router.post("/text", response_model=ResumeAnalysisResponse)
async def analyze_resume_text(request: ResumeAnalysisRequest):
    """
    Analyzes raw resume text against a job description.
    """
    if not request.resume_text or not request.resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text cannot be empty.",
        )

    resume_text = request.resume_text.strip()
    words = resume_text.split()
    word_count = len(words)
    page_count = max(1, (word_count + 399) // 400)

    metadata = ResumeMetadata(
        filename="Direct Input",
        word_count=word_count,
        character_count=len(resume_text),
        page_count=page_count,
        detected_emails=extract_emails(resume_text),
        detected_phones=extract_phone_numbers(resume_text),
        detected_links=extract_links(resume_text),
    )

    breakdown, sections, matched_skills, missing_skills = calculate_ats_score(
        resume_text=resume_text,
        job_description=request.job_description,
        word_count=word_count,
        page_count=page_count,
    )

    suggestions = generate_ats_suggestions(
        breakdown=breakdown,
        sections=sections,
        missing_skills=missing_skills,
        word_count=word_count,
    )

    if breakdown.overall_score >= 80:
        verdict = "Excellent Match! Your resume is highly optimized for this job description."
    elif breakdown.overall_score >= 60:
        verdict = "Good Foundation. A few targeted keyword additions will significantly improve your match."
    else:
        verdict = "Needs Optimization. Tailor your skills and keywords closely to the target job description."

    return ResumeAnalysisResponse(
        success=True,
        metadata=metadata,
        scores=breakdown,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        detected_sections=sections,
        suggestions=suggestions,
        summary_verdict=verdict,
    )


@router.get("/taxonomy")
async def get_taxonomy():
    """
    Returns the supported skills taxonomy categories and list.
    """
    return {"taxonomy": SKILL_TAXONOMY}
