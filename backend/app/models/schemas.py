from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    status: str = "ok"
    version: str
    service: str
    cors_origins: List[str]


class ResumeAnalysisRequest(BaseModel):
    resume_text: Optional[str] = None
    job_description: str
    target_role: Optional[str] = None


class MatchedKeywordsDetail(BaseModel):
    count_summary: str = Field(..., description="Summary string, e.g., '12 of 16 matched'")
    matched_count: int
    total_jd_keywords: int
    items: List[str] = []


class SkillGroupDetail(BaseModel):
    matched: List[str] = []
    missing: List[str] = []


class SkillMatchItem(BaseModel):
    name: str
    category: Optional[str] = "General"
    status: str = "matched"
    importance: Optional[str] = "High"


class ExperienceFitDetail(BaseModel):
    rating: str = Field(..., description="'Strong', 'Moderate', or 'Low'")
    candidate_years_detected: Optional[int] = None
    jd_years_required: Optional[int] = None
    candidate_seniority: str = "Mid-Level"
    jd_seniority: str = "Mid-Level"
    summary: str


class AtsSuggestionItem(BaseModel):
    type: str = Field(..., description="'critical', 'warning', or 'tip'")
    category: str = "General"
    title: str
    description: str


class AtsSuggestion(AtsSuggestionItem):
    pass


class ResumeMetadata(BaseModel):
    filename: Optional[str] = None
    word_count: int = 0
    character_count: int = 0
    page_count: Optional[int] = 1
    detected_emails: List[str] = []
    detected_phones: List[str] = []
    detected_links: List[str] = []


class ScoreBreakdown(BaseModel):
    keyword_match: float
    skills_match: float
    formatting_score: float
    sections_score: float
    overall_score: float


class SectionDetection(BaseModel):
    contact_info: bool = False
    summary: bool = False
    work_experience: bool = False
    skills: bool = False
    education: bool = False
    projects: bool = False
    certifications: bool = False


class AtsAuditIssueItem(BaseModel):
    id: str
    category: str = Field(..., description="'Contact Information', 'Section Headings', or 'Layout & Readability'")
    severity: str = Field(..., description="'pass', 'medium', or 'high'")
    passed: bool = True
    title: str
    description: str
    suggested_fix: str


class AtsHealthAuditResult(BaseModel):
    health_score: int = Field(..., ge=0, le=100)
    health_grade: str = Field(..., description="'Excellent', 'Good', 'Needs Improvement', or 'Critical Issues'")
    summary: str
    total_checks: int
    passed_checks: int
    failed_checks: int
    issues: List[AtsAuditIssueItem] = []


class ResumeAnalysisResponse(BaseModel):
    success: bool = True
    ats_score: float = Field(..., ge=0, le=100, description="Overall ATS Match Percentage")
    similarity_score: float = Field(..., ge=0, le=100, description="TF-IDF Cosine Similarity Percentage")
    skills_score: float = Field(..., ge=0, le=100, description="Skills Coverage Percentage")
    matched_keywords: MatchedKeywordsDetail
    technical_skills: SkillGroupDetail
    soft_skills: SkillGroupDetail
    missing_critical_skills: List[str] = []
    experience_fit: ExperienceFitDetail
    sections_detected: Dict[str, bool] = {}
    suggestions: List[AtsSuggestionItem] = []
    metadata: ResumeMetadata
    summary_verdict: str
    scores: Optional[ScoreBreakdown] = None
    ats_health_audit: Optional[AtsHealthAuditResult] = None



class BulletRewriteRequest(BaseModel):
    bullet: str = Field(..., description="Raw or weak bullet point to rewrite")
    target_role: Optional[str] = Field(None, description="Optional target position or job title")


class BulletVariationItem(BaseModel):
    type: str
    label: str
    text: str
    focus: str
    badge: str
    impact_metric: str
    action_verb: str


class BulletRewriteResponse(BaseModel):
    success: bool = True
    original_bullet: str
    target_role: Optional[str] = None
    domain_detected: Optional[str] = "general"
    technologies_extracted: List[str] = []
    variations: List[str]
    variation_details: List[BulletVariationItem] = []
    action_verbs_used: List[str] = []


class CoverLetterRequest(BaseModel):
    candidate_name: Optional[str] = Field(None, description="Candidate's full name")
    target_role: Optional[str] = Field(None, description="Target job title / role")
    skills: Optional[List[str]] = Field(default=[], description="List of matched candidate skills")
    experience_summary: Optional[str] = Field(None, description="Candidate seniority or experience summary")
    job_description: str = Field(..., description="Target Job Description text")
    tone: Optional[str] = Field("Professional", description="'Professional', 'Enthusiastic', or 'Concise'")
    resume_text: Optional[str] = Field(None, description="Optional raw resume text")


class CoverLetterResponse(BaseModel):
    success: bool = True
    cover_letter: str
    word_count: int
    tone: str
    candidate_name: str
    target_role: str
    company_name: Optional[str] = "the Hiring Team"
    matched_skills: List[str] = []


class StarFrameworkOutline(BaseModel):
    situation: str
    task: str
    action: str
    result: str
    full_outline: str


class InterviewQuestionItem(BaseModel):
    id: int
    question: str
    category: str = Field(..., description="'Technical Gap', 'System Design / Architecture', or 'Behavioral & Leadership'")
    difficulty: str = Field(..., description="'Junior', 'Mid', 'Senior', or 'All Levels'")
    targeted_skill: str
    why_interviewer_asks_this: str
    star_framework_outline: StarFrameworkOutline
    keywords_to_mention: List[str] = []


class InterviewPrepRequest(BaseModel):
    matched_skills: Optional[List[str]] = Field(default=[], description="Candidate's matched skills")
    missing_skills: Optional[List[str]] = Field(default=[], description="Candidate's missing skills from ATS analysis")
    target_role: Optional[str] = Field(None, description="Target job role")
    seniority_level: Optional[str] = Field(None, description="Detected or target seniority level")
    job_description: Optional[str] = Field(None, description="Target Job Description")
    resume_text: Optional[str] = Field(None, description="Raw resume text")


class InterviewPrepResponse(BaseModel):
    success: bool = True
    target_role: str
    seniority_level: str
    total_questions: int
    questions: List[InterviewQuestionItem]



