import re
from typing import Dict, List, Tuple, Any
from app.models.schemas import (
    ScoreBreakdown,
    SectionDetection,
    AtsSuggestion,
    SkillMatchItem,
)
from app.services.nlp_service import extract_skills, calculate_similarity

# Common section headers in resumes
SECTION_PATTERNS = {
    "contact_info": r"(phone|email|linkedin|github|portfolio|contact|address|tel)",
    "summary": r"(summary|objective|profile|about me|professional summary|executive summary)",
    "work_experience": r"(experience|work experience|employment|work history|professional experience|career)",
    "skills": r"(skills|technical skills|competencies|technologies|proficiencies|core competencies)",
    "education": r"(education|academic background|qualifications|degrees|university|college)",
    "projects": r"(projects|personal projects|key projects|academic projects)",
    "certifications": r"(certifications|certificates|licenses|accreditations|credentials)",
}

# Strong action verbs for ATS impact
STRONG_ACTION_VERBS = [
    "spearheaded", "engineered", "orchestrated", "architected", "developed", "deployed",
    "optimized", "accelerated", "scaled", "automated", "designed", "streamlined",
    "implemented", "reduced", "increased", "mentored", "achieved", "delivered"
]


def detect_sections(text: str) -> SectionDetection:
    """
    Checks whether standard ATS sections are present in resume text.
    """
    text_lower = text.lower()
    detection_dict = {}

    for section, pattern in SECTION_PATTERNS.items():
        match = re.search(rf"\b{pattern}\b", text_lower)
        detection_dict[section] = bool(match)

    return SectionDetection(**detection_dict)


def evaluate_formatting(text: str, word_count: int, page_count: int) -> float:
    """
    Assesses ATS readability factors such as word count, length, and metric usage.
    """
    score = 100.0

    # Ideal resume length is 350 - 1000 words
    if word_count < 250:
        score -= 25.0
    elif word_count < 350:
        score -= 10.0
    elif word_count > 1500:
        score -= 15.0

    # Ideal page count is 1-2 pages
    if page_count > 3:
        score -= 15.0

    # Check for quantitative metrics (% or $ or numbers)
    numbers_count = len(re.findall(r"\b\d+(?:[\.,]\d+)?%?|\$\d+", text))
    if numbers_count < 3:
        score -= 15.0
    elif numbers_count < 6:
        score -= 5.0

    # Check for action verbs
    verb_count = sum(1 for verb in STRONG_ACTION_VERBS if re.search(rf"\b{verb}\b", text, re.IGNORECASE))
    if verb_count < 3:
        score -= 10.0

    return max(0.0, min(100.0, score))


def calculate_ats_score(
    resume_text: str,
    job_description: str,
    word_count: int,
    page_count: int,
) -> Tuple[ScoreBreakdown, SectionDetection, List[SkillMatchItem], List[SkillMatchItem]]:
    """
    Calculates overall ATS score and detailed breakdowns.
    """
    # 1. Detect Sections
    sections = detect_sections(resume_text)
    total_sections = 7
    active_sections = sum([
        sections.contact_info,
        sections.summary,
        sections.work_experience,
        sections.skills,
        sections.education,
        sections.projects,
        sections.certifications,
    ])
    sections_score = round((active_sections / total_sections) * 100.0, 1)

    # 2. Semantic & Keyword match
    keyword_score = calculate_similarity(resume_text, job_description)

    # 3. Skills Analysis
    resume_skills_dict = extract_skills(resume_text)
    jd_skills_dict = extract_skills(job_description)

    resume_all_skills = {s.lower(): (s, cat) for cat, skills in resume_skills_dict.items() for s in skills}
    jd_all_skills = {s.lower(): (s, cat) for cat, skills in jd_skills_dict.items() for s in skills}

    matched_skills: List[SkillMatchItem] = []
    missing_skills: List[SkillMatchItem] = []

    if jd_all_skills:
        for skill_key, (name, cat) in jd_all_skills.items():
            if skill_key in resume_all_skills:
                matched_skills.append(SkillMatchItem(name=name, category=cat, status="matched", importance="High"))
            else:
                missing_skills.append(SkillMatchItem(name=name, category=cat, status="missing", importance="High"))

        skills_score = round((len(matched_skills) / len(jd_all_skills)) * 100.0, 1)
    else:
        # If JD has no extracted skills, base on resume's skill variety
        skills_count = len(resume_all_skills)
        skills_score = min(100.0, round(skills_count * 8.0, 1))
        for skill_key, (name, cat) in resume_all_skills.items():
            matched_skills.append(SkillMatchItem(name=name, category=cat, status="matched", importance="Medium"))

    # 4. Formatting score
    formatting_score = evaluate_formatting(resume_text, word_count, page_count)

    # 5. Composite ATS Score
    # Weights: Keyword Match (35%), Skills Match (30%), Sections (20%), Formatting (15%)
    overall = (
        (keyword_score * 0.35)
        + (skills_score * 0.30)
        + (sections_score * 0.20)
        + (formatting_score * 0.15)
    )
    overall_score = round(min(100.0, max(0.0, overall)), 1)

    breakdown = ScoreBreakdown(
        keyword_match=keyword_score,
        skills_match=skills_score,
        formatting_score=formatting_score,
        sections_score=sections_score,
        overall_score=overall_score,
    )

    return breakdown, sections, matched_skills, missing_skills


def generate_ats_suggestions(
    breakdown: ScoreBreakdown,
    sections: SectionDetection,
    missing_skills: List[SkillMatchItem],
    word_count: int,
) -> List[AtsSuggestion]:
    """
    Generates actionable ATS tips for the user.
    """
    suggestions: List[AtsSuggestion] = []

    # Missing critical sections
    if not sections.work_experience:
        suggestions.append(AtsSuggestion(
            type="critical",
            title="Add 'Work Experience' Section",
            description="Recruiters and ATS parsers look for explicit 'Work Experience' or 'Employment' headings.",
            category="Structure"
        ))

    if not sections.skills:
        suggestions.append(AtsSuggestion(
            type="critical",
            title="Create a Dedicated 'Skills' Section",
            description="Group your hard and soft skills in a distinct section for optimal ATS indexing.",
            category="Skills"
        ))

    if not sections.summary:
        suggestions.append(AtsSuggestion(
            type="tip",
            title="Include a Professional Summary",
            description="A 2-3 sentence tailored summary at the top highlights your value proposition instantly.",
            category="Content"
        ))

    # Missing Skills
    if missing_skills:
        top_missing = [s.name for s in missing_skills[:4]]
        suggestions.append(AtsSuggestion(
            type="warning",
            title="Target High-Priority Keywords",
            description=f"Consider incorporating missing keywords like: {', '.join(top_missing)} where relevant in your bullet points.",
            category="Keywords"
        ))

    # Word count check
    if word_count < 300:
        suggestions.append(AtsSuggestion(
            type="warning",
            title="Expand Bullet Points with Quantifiable Impact",
            description=f"Your resume is relatively concise ({word_count} words). Use metrics (e.g. '% increase', 'saved X hours') to show measurable achievements.",
            category="Content"
        ))

    # Keyword match check
    if breakdown.keyword_match < 50.0:
        suggestions.append(AtsSuggestion(
            type="warning",
            title="Align Phrasing with Job Description",
            description="Adapt terminology to match the specific job posting's language and requirements.",
            category="Alignment"
        ))

    if not suggestions:
        suggestions.append(AtsSuggestion(
            type="tip",
            title="Outstanding ATS Profile",
            description="Your resume closely matches the job description with clear formatting and key sections intact.",
            category="General"
        ))

    return suggestions
