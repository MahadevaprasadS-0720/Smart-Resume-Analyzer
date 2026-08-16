"""
ATS Formatting & Health Audit Service
Evaluates resume structural compliance, contact information presence,
standard section headers, layout & readability anomalies, and calculates
an ATS Health Score (0-100%) with actionable fix recommendations.
"""

import re
from typing import Dict, List, Any, Optional
from app.utils.text_cleaner import extract_emails, extract_phone_numbers, extract_links


# Standard ATS Section Headers to verify
CORE_SECTION_PATTERNS = {
    "experience": {
        "title": "Work Experience / History Section",
        "patterns": [r"\b(work\s+experience|professional\s+experience|experience|employment\s+history|work\s+history)\b"],
        "required": True,
        "weight": 20,
        "missing_fix": "Add a clearly labeled section header like 'Professional Experience' or 'Work History' in standard bold text.",
    },
    "education": {
        "title": "Education Section",
        "patterns": [r"\b(education|academic\s+background|qualifications|academic\s+history)\b"],
        "required": True,
        "weight": 15,
        "missing_fix": "Add an 'Education' header listing your degrees, institutions, and graduation years.",
    },
    "skills": {
        "title": "Skills / Technical Expertise Section",
        "patterns": [r"\b(technical\s+skills|skills|technologies|core\s+competencies|skills\s+&\s+tools|expertise)\b"],
        "required": True,
        "weight": 20,
        "missing_fix": "Create a dedicated 'Technical Skills' or 'Core Competencies' section so ATS parsers can categorize your abilities.",
    },
    "projects": {
        "title": "Projects / Portfolio Section",
        "patterns": [r"\b(projects|technical\s+projects|key\s+projects|portfolio|open\s+source)\b"],
        "required": False,
        "weight": 10,
        "missing_fix": "Include a 'Projects' section with 2-3 high-impact accomplishments showcasing technologies used.",
    },
}


def audit_resume_ats_health(
    resume_text: str,
    raw_lines: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Runs an in-depth ATS formatting and structural health audit on resume text.
    Returns:
      - health_score (0-100)
      - health_grade ('Excellent', 'Good', 'Needs Improvement', 'Critical')
      - issues list with severity ('pass', 'medium', 'high'), title, description, and suggested_fix.
    """
    text = resume_text or ""
    text_lower = text.lower()
    total_words = len(text.split())
    
    issues: List[Dict[str, Any]] = []
    current_score = 100

    # -------------------------------------------------------------
    # 1. Contact Information Audit
    # -------------------------------------------------------------
    # 1.1 Email
    detected_emails = extract_emails(text)
    if detected_emails:
        issues.append({
            "id": "contact_email",
            "category": "Contact Information",
            "severity": "pass",
            "passed": True,
            "title": "Email Address Detected",
            "description": f"Found valid email address: {detected_emails[0]}",
            "suggested_fix": "None needed. Your email is formatted cleanly for automated recruiter contact.",
        })
    else:
        current_score -= 20
        issues.append({
            "id": "contact_email",
            "category": "Contact Information",
            "severity": "high",
            "passed": False,
            "title": "Missing Email Address",
            "description": "No recognizable email address was detected in the document header.",
            "suggested_fix": "Place a standard email address (e.g. name@domain.com) prominently at the very top of your resume.",
        })

    # 1.2 Phone Number
    detected_phones = extract_phone_numbers(text)
    if detected_phones:
        issues.append({
            "id": "contact_phone",
            "category": "Contact Information",
            "severity": "pass",
            "passed": True,
            "title": "Phone Number Detected",
            "description": f"Found contact number: {detected_phones[0]}",
            "suggested_fix": "None needed. Phone format is accessible to automated screeners.",
        })
    else:
        current_score -= 10
        issues.append({
            "id": "contact_phone",
            "category": "Contact Information",
            "severity": "medium",
            "passed": False,
            "title": "Missing Phone Number",
            "description": "No direct phone contact was found in the header contact block.",
            "suggested_fix": "Add a standard international or regional phone number format (e.g., +1 (555) 000-0000) in your header.",
        })

    # 1.3 Professional Links (LinkedIn / GitHub / Portfolio)
    detected_links = extract_links(text)
    has_linkedin = any("linkedin" in link.lower() for link in detected_links) or "linkedin.com" in text_lower
    has_github = any("github" in link.lower() for link in detected_links) or "github.com" in text_lower
    has_portfolio = len(detected_links) > 0 or "http" in text_lower or ".com" in text_lower or ".io" in text_lower

    if has_linkedin or has_github or has_portfolio:
        found_types = []
        if has_linkedin:
            found_types.append("LinkedIn")
        if has_github:
            found_types.append("GitHub")
        if not has_linkedin and not has_github and has_portfolio:
            found_types.append("Portfolio")

        issues.append({
            "id": "contact_links",
            "category": "Contact Information",
            "severity": "pass",
            "passed": True,
            "title": f"Professional Profile Links Detected ({', '.join(found_types)})",
            "description": "Verified presence of online portfolio or professional network profiles.",
            "suggested_fix": "Ensure links are clickable and point to up-to-date repositories and profiles.",
        })
    else:
        current_score -= 10
        issues.append({
            "id": "contact_links",
            "category": "Contact Information",
            "severity": "medium",
            "passed": False,
            "title": "Missing LinkedIn / GitHub / Portfolio Link",
            "description": "No LinkedIn URL, GitHub profile, or online portfolio link was identified.",
            "suggested_fix": "Add your clean LinkedIn profile URL (e.g. linkedin.com/in/yourname) and GitHub/portfolio link to verify work samples.",
        })

    # -------------------------------------------------------------
    # 2. Standard Section Header Audit
    # -------------------------------------------------------------
    for sec_key, sec_data in CORE_SECTION_PATTERNS.items():
        found = False
        for pat in sec_data["patterns"]:
            if re.search(pat, text_lower):
                found = True
                break
        
        if found:
            issues.append({
                "id": f"section_{sec_key}",
                "category": "Section Headings",
                "severity": "pass",
                "passed": True,
                "title": f"Standard '{sec_data['title']}' Header Found",
                "description": f"ATS parser successfully mapped the {sec_key} section.",
                "suggested_fix": "Keep standard wording so older ATS parsers can continue indexing without ambiguity.",
            })
        else:
            if sec_data["required"]:
                current_score -= sec_data["weight"]
                issues.append({
                    "id": f"section_{sec_key}",
                    "category": "Section Headings",
                    "severity": "high",
                    "passed": False,
                    "title": f"Missing or Non-Standard '{sec_data['title']}'",
                    "description": f"Could not detect a standard {sec_key} heading. ATS systems may fail to parse this entire block.",
                    "suggested_fix": sec_data["missing_fix"],
                })
            else:
                current_score -= sec_data["weight"]
                issues.append({
                    "id": f"section_{sec_key}",
                    "category": "Section Headings",
                    "severity": "medium",
                    "passed": False,
                    "title": f"Optional '{sec_data['title']}' Not Detected",
                    "description": f"Adding a distinct {sec_key} section increases domain keyword density and credibility.",
                    "suggested_fix": sec_data["missing_fix"],
                })

    # -------------------------------------------------------------
    # 3. Layout & Readability Analysis
    # -------------------------------------------------------------
    # 3.1 Word Count Range Check (200 - 1200 words)
    if 300 <= total_words <= 1000:
        issues.append({
            "id": "readability_word_count",
            "category": "Layout & Readability",
            "severity": "pass",
            "passed": True,
            "title": f"Optimal Word Count ({total_words} words)",
            "description": "Resume length falls squarely within the ideal 1-to-2 page ATS screening range (300-1000 words).",
            "suggested_fix": "Maintain concise bullet points with quantifiable impact metrics.",
        })
    elif 200 <= total_words < 300:
        current_score -= 8
        issues.append({
            "id": "readability_word_count",
            "category": "Layout & Readability",
            "severity": "medium",
            "passed": False,
            "title": f"Brief Resume Length ({total_words} words)",
            "description": "Your resume is slightly sparse. Recruiters typically look for 350-700 words of technical depth.",
            "suggested_fix": "Expand your experience bullet points with specific technical implementations, responsibilities, and quantified business impact.",
        })
    elif total_words < 200:
        current_score -= 15
        issues.append({
            "id": "readability_word_count",
            "category": "Layout & Readability",
            "severity": "high",
            "passed": False,
            "title": f"Critically Low Word Count ({total_words} words)",
            "description": "The resume has too little text to pass automated keyword density filters.",
            "suggested_fix": "Flesh out detailed project descriptions, technology stacks, and achievement bullet points.",
        })
    elif total_words > 1200:
        current_score -= 10
        issues.append({
            "id": "readability_word_count",
            "category": "Layout & Readability",
            "severity": "medium",
            "passed": False,
            "title": f"Excessive Document Length ({total_words} words)",
            "description": "Resume exceeds standard 2-page limits. Long text blocks can degrade ATS scanning and recruiter attention.",
            "suggested_fix": "Condense older work history and remove redundant phrases to target 500-900 high-impact words.",
        })
    else:
        # 1000-1200 words (Acceptable for senior candidates)
        issues.append({
            "id": "readability_word_count",
            "category": "Layout & Readability",
            "severity": "pass",
            "passed": True,
            "title": f"Comprehensive Word Count ({total_words} words)",
            "description": "Document length is suitable for a 2-page detailed technical resume.",
            "suggested_fix": "Ensure the first half of page 1 captures top skills and recent achievements.",
        })

    # 3.2 Special Characters & Glyphs Hygiene
    unusual_chars = re.findall(r"[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD\u200B\u200C\u200D]", text)
    if not unusual_chars:
        issues.append({
            "id": "formatting_hygiene",
            "category": "Layout & Readability",
            "severity": "pass",
            "passed": True,
            "title": "Clean Character Encoding & Typography",
            "description": "No corrupted glyphs, zero-width spaces, or broken font artifacts detected.",
            "suggested_fix": "Continue using standard fonts (e.g. Arial, Calibri, Inter, Roboto) and standard bullet symbols.",
        })
    else:
        current_score -= 10
        issues.append({
            "id": "formatting_hygiene",
            "category": "Layout & Readability",
            "severity": "medium",
            "passed": False,
            "title": "Special Character / Encoding Anomalies Detected",
            "description": f"Detected {len(unusual_chars)} non-standard or unprintable characters that may break older ATS parsers.",
            "suggested_fix": "Replace custom graphic icons, complex tables, or unusual bullet symbols with standard UTF-8 characters.",
        })

    # 3.3 Multi-column / Layout Anomaly Check
    # Heuristic: detect high frequency of single-word or very short lines indicating narrow side columns
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
    if lines:
        short_lines_ratio = sum(1 for ln in lines if len(ln.split()) <= 2) / len(lines)
        if short_lines_ratio > 0.45 and len(lines) > 25:
            current_score -= 12
            issues.append({
                "id": "layout_columns",
                "category": "Layout & Readability",
                "severity": "medium",
                "passed": False,
                "title": "Potential Multi-Column / Text-Box Layout Anomaly",
                "description": "A high proportion of truncated line fragments was detected, suggesting multi-column tables or floating text boxes.",
                "suggested_fix": "Use a clean single-column linear layout without floating text boxes to prevent ATS line scrambling.",
            })
        else:
            issues.append({
                "id": "layout_columns",
                "category": "Layout & Readability",
                "severity": "pass",
                "passed": True,
                "title": "Linear Single-Column Layout Structure",
                "description": "Text flows logically from top to bottom without table parsing disruptions.",
                "suggested_fix": "Maintain single-column hierarchy for maximum cross-platform ATS compatibility.",
            })

    # Final Score Normalization & Grading
    final_score = max(0, min(100, current_score))
    
    if final_score >= 85:
        grade = "Excellent"
        summary = "Outstanding ATS structural health! Your resume uses standard headings, clear contact info, and clean single-column formatting."
    elif final_score >= 70:
        grade = "Good"
        summary = "Good ATS compatibility with minor formatting or contact details that can be polished for higher pass rates."
    elif final_score >= 50:
        grade = "Needs Improvement"
        summary = "Several formatting or structural issues detected that may cause ATS parsing gaps or dropped sections."
    else:
        grade = "Critical Issues"
        summary = "Critical structural deficiencies detected (missing essential headers or contact info). Immediate formatting fixes recommended."

    passed_count = sum(1 for iss in issues if iss["passed"])
    failed_count = len(issues) - passed_count

    return {
        "health_score": final_score,
        "health_grade": grade,
        "summary": summary,
        "total_checks": len(issues),
        "passed_checks": passed_count,
        "failed_checks": failed_count,
        "issues": issues,
    }
