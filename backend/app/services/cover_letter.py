"""
AI Cover Letter Generator Service
Generates structured, tailored cover letters mapped to candidate profile and Job Description,
supporting 3 tones: 'Professional', 'Enthusiastic', and 'Concise'.
"""

import re
from typing import Dict, List, Optional, Any
from app.services.nlp_analyzer import extract_skills_and_keywords, extract_years_of_experience, detect_seniority


def extract_company_name(jd_text: str) -> str:
    """Extracts likely company name from Job Description or defaults gracefully."""
    patterns = [
        r"(?:at|join|about)\s+([A-Z][A-Za-z0-9\.\s]{2,20}?)(?:\s+is|\s+we|\s+team|\s+hiring|\,|\.|\n)",
        r"(?:company|organization):\s*([A-Za-z0-9\s]{2,25})",
    ]
    for pattern in patterns:
        m = re.search(pattern, jd_text)
        if m:
            candidate = m.group(1).strip()
            if candidate.lower() not in ["the", "our", "a", "an", "this", "we", "your"]:
                return candidate
    return "the Hiring Team"


def extract_target_role(jd_text: str, default_role: Optional[str] = None) -> str:
    """Extracts target role from JD or uses default."""
    if default_role and default_role.strip():
        return default_role.strip()
    
    role_patterns = [
        r"(?:role|position|title|looking for a|seeking an?)\s*:?\s*([A-Za-z0-9\s\/\-\+]{3,35}?)(?:\s+to|\s+who|\n|\.|\,)",
        r"^([A-Z][A-Za-z0-9\s\/\-\+]{3,35}?)(?:\n|\s*-\s*|\s*–\s*)",
    ]
    for pattern in role_patterns:
        m = re.search(pattern, jd_text, re.MULTILINE)
        if m:
            candidate = m.group(1).strip()
            if len(candidate.split()) <= 5 and not candidate.lower().startswith("we "):
                return candidate.title()
                
    return "Senior Software Engineer"


def format_cover_letter(
    candidate_name: str,
    target_role: str,
    company_name: str,
    matched_skills: List[str],
    years_exp: int,
    seniority: str,
    tone: str = "Professional",
) -> str:
    """
    Generates structured cover letter text with 5 standard sections:
      1. Header & Greeting
      2. Hook / Introduction
      3. Core Alignment & Impact
      4. Culture & Enthusiasm
      5. Strong Closing & CTA
    """
    tone = tone.title() if tone else "Professional"
    if tone not in ["Professional", "Enthusiastic", "Concise"]:
        tone = "Professional"

    skills_str = ", ".join(matched_skills[:4]) if matched_skills else "modern software engineering, architecture, and scalable systems"
    top_skill = matched_skills[0] if matched_skills else "high-throughput system development"
    secondary_skill = matched_skills[1] if len(matched_skills) > 1 else "cloud infrastructure"

    # Header info
    header = f"{candidate_name}\nContact: Candidate Profile • Portfolio & GitHub\nDate: August 16, 2026\n\nTo: Hiring Committee\n{company_name}\n\nDear Hiring Manager,"

    # 1. Professional Tone
    if tone == "Professional":
        hook = (
            f"I am writing to express my strong interest in the {target_role} position at {company_name}. "
            f"With over {years_exp or 4} years of dedicated experience specializing in {skills_str}, "
            f"I have established a track record of delivering resilient, high-performance software systems that align directly with your organizational objectives."
        )
        core_alignment = (
            f"In reviewing your requirements for the {target_role} role, I noted your emphasis on {top_skill} and {secondary_skill}. "
            f"In my recent engagements, I spearheaded the architecture and optimization of critical backend and distributed services, "
            f"consistently reducing latency by over 35% and elevating system availability to 99.95%. "
            f"My hands-on proficiency across {skills_str} enables me to rapidly diagnose complex architectural challenges and transform business specifications into scalable, production-grade solutions."
        )
        culture_fit = (
            f"What particularly distinguishes {company_name} is your commitment to engineering excellence and scalable innovation. "
            f"I thrive in collaborative, high-standard engineering cultures where cross-functional alignment, rigorous code quality, and measurable outcomes drive product momentum."
        )
        closing = (
            f"I welcome the opportunity to discuss in detail how my background in {skills_str} will deliver immediate value to your engineering initiatives. "
            f"Thank you for your time and consideration. I look forward to speaking with you regarding next steps.\n\nSincerely,\n{candidate_name}"
        )

    # 2. Enthusiastic Tone
    elif tone == "Enthusiastic":
        hook = (
            f"I was thrilled to discover the opening for a {target_role} at {company_name}! "
            f"As an engineer deeply passionate about building transformative technology with {skills_str}, "
            f"I have spent the past {years_exp or 4}+ years crafting robust products that users love and engineering teams are proud of."
        )
        core_alignment = (
            f"Your mission immediately resonated with me, especially your focus on mastering {top_skill} and pushing the boundaries of {secondary_skill}. "
            f"Throughout my career, I have energized teams by championing modern best practices, accelerating delivery velocity by 40%, and turning ambitious product roadmaps into reality. "
            f"Whether optimizing data pipelines or designing frictionless user journeys with {skills_str}, I bring boundless curiosity, high energy, and rigorous execution to every sprint."
        )
        culture_fit = (
            f"{company_name}'s culture of rapid experimentation and high-impact innovation is precisely where I do my best work. "
            f"I am excited by the prospect of collaborating with your talented team to build scalable systems that make a lasting difference."
        )
        closing = (
            f"I would love the opportunity to connect and share more about how my enthusiasm and expertise in {skills_str} can accelerate your team's upcoming milestones! "
            f"Thank you for considering my application.\n\nWarm regards,\n{candidate_name}"
        )

    # 3. Concise Tone
    else:
        hook = (
            f"Please accept my application for the {target_role} role at {company_name}. "
            f"With {years_exp or 4}+ years of verified expertise in {skills_str}, I offer immediate, hands-on impact for your engineering roadmap."
        )
        core_alignment = (
            f"Key qualifications tailored to your requirements:\n"
            f"• Core Competency in {top_skill}: Designed and deployed high-throughput systems serving millions of transactions with sub-50ms latency.\n"
            f"• Mastery of {secondary_skill} & Tooling: Proven experience delivering reliable CI/CD pipelines, automated testing (92%+ coverage), and modular architecture.\n"
            f"• Measurable Impact: Consistently achieved 30%+ performance gains and reduced operational infrastructure costs through systematic optimization."
        )
        culture_fit = (
            f"I prioritize clean code, rapid iteration, and direct alignment with business objectives to deliver tangible results with minimal overhead."
        )
        closing = (
            f"I am available at your earliest convenience for a discussion on how I can contribute to {company_name}'s immediate goals. "
            f"Thank you for your time.\n\nBest regards,\n{candidate_name}"
        )

    # Combine full letter
    full_cover_letter = f"{header}\n\n{hook}\n\n{core_alignment}\n\n{culture_fit}\n\n{closing}"
    return full_cover_letter


def generate_cover_letter_service(
    candidate_name: Optional[str] = None,
    target_role: Optional[str] = None,
    skills: Optional[List[str]] = None,
    experience_summary: Optional[str] = None,
    job_description: str = "",
    tone: str = "Professional",
    resume_text: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Main orchestrator for Cover Letter generation.
    Parses inputs, matches skills against JD, calibrates tone, and returns formatted text.
    """
    # 1. Candidate Name resolution
    resolved_name = candidate_name.strip() if candidate_name and candidate_name.strip() else "Alex Morgan"
    
    # 2. Target Role resolution
    resolved_role = extract_target_role(job_description, target_role)
    
    # 3. Company Name resolution
    company_name = extract_company_name(job_description)
    
    # 4. Skills extraction and matching
    matched_skills = []
    if skills and len(skills) > 0:
        matched_skills = [s for s in skills if s.strip()]
    
    if not matched_skills and resume_text:
        res_analysis = extract_skills_and_keywords(resume_text)
        jd_analysis = extract_skills_and_keywords(job_description)
        jd_keys = jd_analysis["all_skill_keys"]
        for s in res_analysis["technical_skills"]:
            if s["raw"] in jd_keys:
                matched_skills.append(s["name"])
        if not matched_skills:
            matched_skills = [s["name"] for s in res_analysis["technical_skills"][:5]]
            
    if not matched_skills:
        # Default skills based on role
        if "backend" in resolved_role.lower() or "python" in job_description.lower():
            matched_skills = ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"]
        elif "frontend" in resolved_role.lower() or "react" in job_description.lower():
            matched_skills = ["React", "TypeScript", "Tailwind CSS", "Next.js", "REST APIs"]
        elif "data" in resolved_role.lower() or "sql" in job_description.lower():
            matched_skills = ["Python", "SQL", "Pandas", "ETL Pipelines", "Power BI"]
        else:
            matched_skills = ["Full-Stack Development", "Cloud Architecture", "REST APIs", "CI/CD"]

    # 5. Experience years resolution
    years_detected = 0
    seniority = "Mid-Level"
    if resume_text:
        years_detected = extract_years_of_experience(resume_text)
        seniority = detect_seniority(resume_text)
    if years_detected == 0:
        years_detected = 4

    # 6. Format the complete letter
    cover_letter_text = format_cover_letter(
        candidate_name=resolved_name,
        target_role=resolved_role,
        company_name=company_name,
        matched_skills=matched_skills,
        years_exp=years_detected,
        seniority=seniority,
        tone=tone,
    )

    words = len(cover_letter_text.split())

    return {
        "success": True,
        "cover_letter": cover_letter_text,
        "word_count": words,
        "tone": tone.title(),
        "candidate_name": resolved_name,
        "target_role": resolved_role,
        "company_name": company_name,
        "matched_skills": matched_skills,
    }
