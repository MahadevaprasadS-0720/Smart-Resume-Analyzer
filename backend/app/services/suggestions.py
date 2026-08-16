import re
from typing import List, Dict, Any

# Power action verbs that increase recruiter impact
POWER_ACTION_VERBS = [
    "spearheaded", "engineered", "orchestrated", "architected", "developed", "deployed",
    "optimized", "accelerated", "scaled", "automated", "designed", "streamlined",
    "implemented", "reduced", "increased", "mentored", "achieved", "delivered"
]

WEAK_ACTION_VERBS = [
    "worked on", "helped with", "assisted in", "responsible for", "handled", "participated in"
]

SECTION_PATTERNS = {
    "contact_info": r"(phone|email|linkedin|github|portfolio|contact|tel)",
    "summary": r"(summary|objective|profile|about me|professional summary|executive summary)",
    "work_experience": r"(experience|work experience|employment|work history|professional experience)",
    "skills": r"(skills|technical skills|competencies|technologies|proficiencies)",
    "education": r"(education|academic background|qualifications|degrees|university)",
    "projects": r"(projects|key projects|personal projects)",
    "certifications": r"(certifications|certificates|accreditations)",
}


def detect_resume_sections(text: str) -> Dict[str, bool]:
    """
    Detects presence of key standard resume sections.
    """
    text_lower = text.lower()
    return {sec: bool(re.search(rf"\b{pat}\b", text_lower)) for sec, pat in SECTION_PATTERNS.items()}


def generate_actionable_suggestions(
    nlp_results: Dict[str, Any],
    resume_text: str,
    word_count: int,
    page_count: int,
) -> List[Dict[str, str]]:
    """
    Generates targeted, concrete advice for the candidate to tailor their resume for this specific JD.
    """
    suggestions = []
    missing_tech = nlp_results.get("technical_skills", {}).get("missing", [])
    missing_soft = nlp_results.get("soft_skills", {}).get("missing", [])
    experience_fit = nlp_results.get("experience_fit", {})
    sections = detect_resume_sections(resume_text)

    # 1. Missing Critical Technical Skills (Highest Priority)
    if missing_tech:
        top_tech = missing_tech[:4]
        suggestions.append({
            "type": "critical",
            "category": "Targeted Keywords",
            "title": f"Incorporate Missing Key Technologies ({', '.join(top_tech)})",
            "description": f"The job description highlights requirements in {', '.join(top_tech)}. Add direct project bullet points or experience entries mentioning these tools where applicable.",
        })

    # 2. Missing Soft / Methodological Skills
    if missing_soft:
        top_soft = missing_soft[:3]
        suggestions.append({
            "type": "warning",
            "category": "Soft Skills & Process",
            "title": f"Highlight Collaborative Keywords ({', '.join(top_soft)})",
            "description": f"Recruiters look for working style indicators like {', '.join(top_soft)}. Weave these into your accomplishments (e.g. 'Collaborated across Agile sprints...').",
        })

    # 3. Experience Fit Alignment
    if experience_fit.get("rating") == "Low":
        suggestions.append({
            "type": "critical",
            "category": "Experience Fit",
            "title": "Emphasize Project Scope and Complexity",
            "description": "Your detected years of experience are below the JD requirement. Compensate by highlighting complex architectural ownership, high-impact projects, or specialized certifications.",
        })

    # 4. Quantifiable Metrics & Numbers
    numbers_count = len(re.findall(r"\b\d+(?:[\.,]\d+)?%?|\$\d+", resume_text))
    if numbers_count < 4:
        suggestions.append({
            "type": "warning",
            "category": "Impact Metrics",
            "title": "Quantify Achievements with Data & Percentages",
            "description": "Bullet points with numbers (e.g., 'Boosted performance by 35%', 'Reduced latency from 250ms to 40ms', 'Managed $50k budget') rank significantly higher with ATS and hiring managers.",
        })

    # 5. Action Verbs Check
    text_lower = resume_text.lower()
    weak_found = [w for w in WEAK_ACTION_VERBS if w in text_lower]
    if weak_found:
        suggestions.append({
            "type": "warning",
            "category": "Action Verbs",
            "title": "Replace Passive Language with High-Impact Verbs",
            "description": f"Replace phrases like '{weak_found[0]}' with dynamic verbs such as 'Spearheaded', 'Engineered', 'Optimized', or 'Architected'.",
        })

    # 6. Missing Structural Sections
    if not sections.get("work_experience"):
        suggestions.append({
            "type": "critical",
            "category": "Structure",
            "title": "Add an Explicit 'Work Experience' Section Header",
            "description": "ATS parsers look for standard headings like 'Work Experience' or 'Professional Experience' to index your career history.",
        })

    if not sections.get("skills"):
        suggestions.append({
            "type": "critical",
            "category": "Structure",
            "title": "Create a Dedicated 'Technical Skills' Section",
            "description": "Group your technologies, tools, and languages together under a clear 'Skills' heading at the top or bottom of your resume.",
        })

    if not sections.get("summary"):
        suggestions.append({
            "type": "tip",
            "category": "Content",
            "title": "Add a Tailored 2-Sentence Professional Summary",
            "description": "Introduce yourself right below your name with your core specialization aligned directly with the target job title.",
        })

    # 7. Word Count & Length Calibration
    if word_count < 250:
        suggestions.append({
            "type": "warning",
            "category": "Formatting",
            "title": "Expand Resume Detail (Current: Under 250 words)",
            "description": "Your resume is brief. Expand bullet points using the STAR method (Situation, Task, Action, Result) to provide sufficient depth.",
        })
    elif word_count > 1400:
        suggestions.append({
            "type": "tip",
            "category": "Formatting",
            "title": "Condense Resume for Readability (Current: Over 1400 words)",
            "description": "Aim for a punchy 1-2 page document (400-900 words) focused strictly on relevant experience for this specific role.",
        })

    if not suggestions:
        suggestions.append({
            "type": "tip",
            "category": "General",
            "title": "Strong Match Profile",
            "description": "Your resume effectively matches the requirements and structure of this job description.",
        })

    return suggestions
