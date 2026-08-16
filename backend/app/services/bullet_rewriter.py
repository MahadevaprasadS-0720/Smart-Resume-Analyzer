"""
AI Bullet Point Rewriter Service
Applies Google's XYZ Formula (Accomplished [X] as measured by [Y] by doing [Z])
and NLP Action-Verb Enhancement to transform weak resume bullet points into high-impact accomplishments.
"""

import re
from typing import Dict, List, Optional, Any, Tuple
from app.services.nlp_analyzer import TECH_SKILL_MAP, SOFT_SKILL_SET

# High-impact Power Action Verbs categorized by intent
ACTION_VERB_CATALOG = {
    "impact": [
        "Optimized", "Accelerated", "Scaled", "Boosted", "Streamlined",
        "Maximized", "Reduced", "Yielded", "Generated", "Automated"
    ],
    "leadership": [
        "Spearheaded", "Architected", "Championed", "Orchestrated", "Led",
        "Directed", "Pioneered", "Mentored", "Mobilized", "Standardized"
    ],
    "technical": [
        "Engineered", "Implemented", "Designed", "Refactored", "Constructed",
        "Deployed", "Integrated", "Configured", "Developed", "Formulated"
    ]
}

WEAK_VERB_PATTERNS = [
    r"\bworked on\b", r"\bhelped with\b", r"\bassisted in\b", r"\bresponsible for\b",
    r"\bhandled\b", r"\bparticipated in\b", r"\bdid\b", r"\bmade\b", r"\bfixed\b",
    r"\btried to\b", r"\blooked after\b", r"\bwas involved in\b", r"\bcontributed to\b"
]


def extract_keywords_from_bullet(text: str) -> Dict[str, List[str]]:
    """
    Extracts technologies, domain concepts, and metrics from the raw bullet point.
    """
    text_lower = f" {text.lower()} "
    tech_detected = []
    
    for term, category in TECH_SKILL_MAP.items():
        escaped = re.escape(term)
        if re.search(rf"(?:\b|\s){escaped}(?:\b|\s)", text_lower):
            display = term.upper() if len(term) <= 3 and term not in ["vue", "git"] else term.title()
            if term == "fastapi":
                display = "FastAPI"
            elif term in ["react", "react.js", "reactjs"]:
                display = "React"
            elif term in ["node.js", "nodejs"]:
                display = "Node.js"
            elif term in ["next.js", "nextjs"]:
                display = "Next.js"
            elif term == "postgresql" or term == "postgres":
                display = "PostgreSQL"
            elif term in ["scikit-learn", "sklearn"]:
                display = "Scikit-Learn"
            elif term == "aws":
                display = "AWS"
            tech_detected.append(display)

    # Deduplicate technologies
    tech_detected = list(dict.fromkeys(tech_detected))
    
    # Extract any existing numbers/percentages
    metrics_detected = re.findall(r"\b\d+(?:[\.,]\d+)?%?|\$\d+", text)

    return {
        "technologies": tech_detected,
        "metrics": metrics_detected,
    }


def clean_raw_bullet(bullet: str) -> str:
    """Cleans leading bullet dashes, numbers, or punctuation."""
    cleaned = re.sub(r"^[\s\*\-\•\–\—\d\.\)]+", "", bullet).strip()
    return cleaned


def detect_domain_context(bullet: str, target_role: Optional[str] = None) -> str:
    """Determines domain flavor: 'frontend', 'backend', 'data', 'devops', or 'general'."""
    text_lower = f"{bullet} {target_role or ''}".lower()
    
    if any(k in text_lower for k in ["frontend", "react", "vue", "angular", "ui", "ux", "css", "html", "javascript", "typescript", "tailwind"]):
        return "frontend"
    if any(k in text_lower for k in ["data", "sql", "analyst", "analytics", "pipeline", "etl", "machine learning", "ml", "nlp", "pandas", "tableau", "power bi"]):
        return "data"
    if any(k in text_lower for k in ["docker", "kubernetes", "cloud", "aws", "gcp", "azure", "ci/cd", "devops", "infrastructure", "terraform"]):
        return "devops"
    if any(k in text_lower for k in ["backend", "python", "api", "fastapi", "django", "flask", "database", "node", "server", "microservice"]):
        return "backend"
    return "general"


def generate_xyz_bullet_variations(
    raw_bullet: str,
    target_role: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Applies Google's XYZ Formula: Accomplished [X] as measured by [Y] by doing [Z].
    Produces 3 distinct variations:
      1. Metric & Impact Focused
      2. Leadership & Ownership Focused
      3. Technical Depth Focused
    """
    cleaned = clean_raw_bullet(raw_bullet)
    extracted = extract_keywords_from_bullet(cleaned)
    techs = extracted["technologies"]
    domain = detect_domain_context(cleaned, target_role)
    
    # Primary tech fallback
    primary_tech = techs[0] if techs else ("Python & FastAPI" if domain == "backend" else ("React & TypeScript" if domain == "frontend" else ("SQL & Python" if domain == "data" else "modern full-stack tools")))
    secondary_tech = techs[1] if len(techs) > 1 else ("PostgreSQL" if domain == "backend" else ("Tailwind CSS" if domain == "frontend" else ("automated pipelines" if domain == "data" else "cloud infrastructure")))
    tech_stack_str = f"{primary_tech} and {secondary_tech}" if primary_tech != secondary_tech else primary_tech

    # Core task extraction (strip weak starting words)
    core_task = cleaned
    for pat in WEAK_VERB_PATTERNS:
        core_task = re.sub(pat, "", core_task, flags=re.IGNORECASE)
    # Clean up artifacts like 'and bugs', 'bugs and', extra whitespace
    core_task = re.sub(r"\b(and\s+fixed\s+bugs|and\s+bugs|fixed\s+bugs)\b", "core services", core_task, flags=re.IGNORECASE)
    core_task = re.sub(r"\s+", " ", core_task).strip()
    core_task = re.sub(r"^(and|the|a|an|to|for|in|with)\s+", "", core_task, flags=re.IGNORECASE).strip()
    core_task = re.sub(r"\s+(and|to|for|in|with)$", "", core_task, flags=re.IGNORECASE).strip()
    if not core_task or len(core_task) < 3:
        core_task = f"core {domain} architecture and workflows"

    # -------------------------------------------------------------
    # 1. Metric & Impact Focused (XYZ Formula)
    # [Action Verb] [Task/System] resulting in [Y% Impact] by implementing [Z Technique/Tech]
    # -------------------------------------------------------------
    if domain == "backend":
        var1_text = f"Optimized backend API performance and resolved critical system bottlenecks, reducing server response latency by 42% and increasing throughput to 3,500+ requests/sec utilizing {tech_stack_str}."
        var1_metric = "42% Latency Reduction"
        var1_verb = "Optimized"
    elif domain == "frontend":
        var1_text = f"Boosted user experience and application responsiveness by refactoring frontend rendering pipelines with {tech_stack_str}, cutting initial page load times by 1.8s and increasing session retention by 28%."
        var1_metric = "+28% Retention & 1.8s Faster Load"
        var1_verb = "Boosted"
    elif domain == "data":
        var1_text = f"Accelerated data processing pipelines and automated analytical reporting, driving a 65% reduction in query execution time and delivering 99.4% reporting accuracy across 2M+ records using {tech_stack_str}."
        var1_metric = "65% Faster Query Execution"
        var1_verb = "Accelerated"
    elif domain == "devops":
        var1_text = f"Automated cloud deployment and infrastructure workflows using {tech_stack_str}, decreasing deployment cycle durations by 70% and eliminating manual configuration downtime."
        var1_metric = "70% Faster Deployments"
        var1_verb = "Automated"
    else:
        var1_text = f"Streamlined {core_task}, achieving a 35% improvement in operational efficiency and cutting error turnaround times by 40% through systematic enhancements using {tech_stack_str}."
        var1_metric = "+35% Efficiency & -40% Errors"
        var1_verb = "Streamlined"

    # -------------------------------------------------------------
    # 2. Leadership & Ownership Focused (XYZ Formula)
    # [Leadership Verb] [Project/Initiative], aligning cross-functional teams to deliver [Z Outcome]
    # -------------------------------------------------------------
    if domain == "backend":
        var2_text = f"Spearheaded the redesign and modularization of {core_task}, orchestrating cross-functional delivery across 4 engineers to achieve 99.95% API uptime and zero-downtime releases."
        var2_metric = "Cross-Team Ownership & 99.95% Uptime"
        var2_verb = "Spearheaded"
    elif domain == "frontend":
        var2_text = f"Championed UI component standardization and accessibility guidelines across team sprints, mentoring 3 junior developers and delivering consistent design system patterns with {tech_stack_str}."
        var2_metric = "Team Mentorship & Standardization"
        var2_verb = "Championed"
    elif domain == "data":
        var2_text = f"Led strategic data governance and pipeline modernization initiatives, establishing standardized data validation protocols adopted company-wide by engineering and business analytics teams."
        var2_metric = "Company-wide Strategic Adoption"
        var2_verb = "Led"
    else:
        var2_text = f"Orchestrated end-to-end delivery of {core_task}, driving cross-functional alignment between engineering and product stakeholders to meet all release milestones 2 weeks ahead of schedule."
        var2_metric = "Delivered 2 Weeks Ahead of Schedule"
        var2_verb = "Orchestrated"

    # -------------------------------------------------------------
    # 3. Technical Depth & Architecture Focused (XYZ Formula)
    # [Technical Verb] [Architectural System] leveraging [Best Practices/Patterns]
    # -------------------------------------------------------------
    if domain == "backend":
        var3_text = f"Architected high-throughput asynchronous services and optimized database indexing schemas with {tech_stack_str}, ensuring sub-50ms query latency and strict fault-tolerant concurrency."
        var3_metric = "Sub-50ms Concurrency & Fault Tolerance"
        var3_verb = "Architected"
    elif domain == "frontend":
        var3_text = f"Engineered scalable, type-safe frontend state architecture with {tech_stack_str}, eliminating redundant network re-renders and reducing client-side memory footprint by 38%."
        var3_metric = "38% Memory Reduction & Type Safety"
        var3_verb = "Engineered"
    elif domain == "data":
        var3_text = f"Constructed resilient ETL extraction and transformation workflows utilizing {tech_stack_str}, implementing robust anomaly detection and automated automated schema migrations."
        var3_metric = "Resilient ETL & Anomaly Detection"
        var3_verb = "Constructed"
    else:
        var3_text = f"Engineered robust modular architecture for {core_task} utilizing {tech_stack_str}, implementing automated unit testing suites with 92% code coverage and strict CI/CD linting standards."
        var3_metric = "92% Test Coverage & Modular Design"
        var3_verb = "Engineered"

    variations_list = [var1_text, var2_text, var3_text]
    action_verbs_used = [var1_verb, var2_verb, var3_verb]

    variation_details = [
        {
            "type": "metric_impact",
            "label": "Metric & Impact Focused",
            "text": var1_text,
            "focus": "Quantifiable Metrics (Google XYZ Formula: Accomplished X measured by Y via Z)",
            "badge": "High Impact",
            "impact_metric": var1_metric,
            "action_verb": var1_verb,
        },
        {
            "type": "leadership_ownership",
            "label": "Leadership & Ownership Focused",
            "text": var2_text,
            "focus": "Initiative, Cross-Functional Leadership, and Delivery Ownership",
            "badge": "Leadership",
            "impact_metric": var2_metric,
            "action_verb": var2_verb,
        },
        {
            "type": "technical_depth",
            "label": "Technical Depth & Architecture",
            "text": var3_text,
            "focus": "Engineering Patterns, Framework Mastery, and Performance Best Practices",
            "badge": "Technical Depth",
            "impact_metric": var3_metric,
            "action_verb": var3_verb,
        },
    ]

    return {
        "success": True,
        "original_bullet": raw_bullet,
        "target_role": target_role,
        "domain_detected": domain,
        "technologies_extracted": techs,
        "variations": variations_list,
        "variation_details": variation_details,
        "action_verbs_used": action_verbs_used,
    }
