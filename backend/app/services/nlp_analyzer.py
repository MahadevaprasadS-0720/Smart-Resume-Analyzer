import re
from typing import Dict, List, Set, Tuple, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# -------------------------------------------------------------
# Skills & Experience Taxonomy
# -------------------------------------------------------------

TECHNICAL_SKILLS: Dict[str, List[str]] = {
    "Programming Languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "c", "golang", "go",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "dart", "sql", "html",
        "html5", "css", "css3", "bash", "shell", "powershell"
    ],
    "Frameworks & Web": [
        "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "angular",
        "node.js", "nodejs", "express", "fastapi", "flask", "django", "spring", "spring boot",
        "asp.net", ".net", "tailwind", "tailwind css", "bootstrap", "framer motion",
        "redux", "graphql", "rest", "restful", "rest api", "websockets", "microservices"
    ],
    "AI & Machine Learning": [
        "machine learning", "deep learning", "nlp", "natural language processing",
        "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
        "spacy", "huggingface", "llm", "large language models", "generative ai", "genai",
        "langchain", "pandas", "numpy", "opencv", "transformers", "rag", "bert", "gpt"
    ],
    "Cloud & DevOps": [
        "aws", "amazon web services", "azure", "microsoft azure", "gcp", "google cloud",
        "docker", "kubernetes", "k8s", "terraform", "ansible", "ci/cd", "jenkins",
        "github actions", "gitlab ci", "linux", "nginx", "serverless", "lambda", "helm"
    ],
    "Databases & Storage": [
        "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch",
        "dynamodb", "sqlite", "cassandra", "oracle", "mariadb", "firebase", "supabase",
        "snowflake", "bigquery"
    ],
    "Testing & Tools": [
        "git", "github", "gitlab", "jira", "confluence", "figma", "postman", "vite",
        "webpack", "jest", "pytest", "cypress", "selenium", "docker-compose", "power bi",
        "tableau"
    ]
}

SOFT_SKILLS: List[str] = [
    "agile", "scrum", "leadership", "communication", "problem solving",
    "project management", "critical thinking", "teamwork", "collaboration",
    "cross-functional", "time management", "mentorship", "adaptability",
    "stakeholder management", "decision making", "analytical skills",
    "creativity", "ownership", "detail oriented", "strategic thinking"
]


def build_skill_map() -> Tuple[Dict[str, str], Set[str]]:
    """Builds lookup dictionaries for technical and soft skills."""
    tech_map = {}
    for category, skills in TECHNICAL_SKILLS.items():
        for skill in skills:
            tech_map[skill.lower()] = category

    soft_set = {s.lower() for s in SOFT_SKILLS}
    return tech_map, soft_set


TECH_SKILL_MAP, SOFT_SKILL_SET = build_skill_map()


# -------------------------------------------------------------
# Skill & Keyword Extraction
# -------------------------------------------------------------

def extract_matched_terms(text: str, candidate_dict_or_set: Any) -> Dict[str, str]:
    """
    Extracts terms with accurate regex word boundary checks.
    Handles special terms like C++, C#, .NET, Node.js, Next.js.
    """
    found = {}
    text_lower = f" {text.lower()} "
    # Normalize punctuation except specific chars (+, #, ., -, /)
    normalized = re.sub(r"[^\w\s\+\#\.\/\-]", " ", text_lower)

    for term in candidate_dict_or_set:
        escaped = re.escape(term)
        pattern = rf"(?:\b|\s){escaped}(?:\b|\s)"
        if re.search(pattern, normalized):
            if isinstance(candidate_dict_or_set, dict):
                category = candidate_dict_or_set[term]
            else:
                category = "Soft Skills"
            # Format display name
            display_name = term.upper() if len(term) <= 3 and term not in ["vue", "git"] else term.title()
            if term == "fastapi":
                display_name = "FastAPI"
            elif term in ["react", "react.js", "reactjs"]:
                display_name = "React"
            elif term in ["next.js", "nextjs"]:
                display_name = "Next.js"
            elif term in ["node.js", "nodejs"]:
                display_name = "Node.js"
            elif term == "postgresql" or term == "postgres":
                display_name = "PostgreSQL"
            elif term in ["scikit-learn", "sklearn"]:
                display_name = "Scikit-Learn"
            elif term == "spacy":
                display_name = "spaCy"
            elif term == "aws":
                display_name = "AWS"
            elif term == "gcp":
                display_name = "GCP"
            elif term in ["k8s", "kubernetes"]:
                display_name = "Kubernetes"

            found[term] = (display_name, category)

    return found


def extract_skills_and_keywords(text: str) -> Dict[str, Any]:
    """
    Extracts technical skills, soft skills, and top TF-IDF keywords from text.
    """
    tech_found = extract_matched_terms(text, TECH_SKILL_MAP)
    soft_found = extract_matched_terms(text, SOFT_SKILL_SET)

    # Format technical skills list
    tech_skills = [{"name": name, "category": cat, "raw": raw} for raw, (name, cat) in tech_found.items()]
    soft_skills = [{"name": name, "category": cat, "raw": raw} for raw, (name, cat) in soft_found.items()]

    # Extract keywords with TF-IDF
    tfidf_keywords = []
    try:
        if text.strip():
            vec = TfidfVectorizer(stop_words="english", max_features=25, ngram_range=(1, 2))
            matrix = vec.fit_transform([text])
            features = vec.get_feature_names_out()
            scores = matrix.toarray()[0]
            keyword_pairs = [(features[i], float(scores[i])) for i in range(len(features))]
            keyword_pairs.sort(key=lambda x: x[1], reverse=True)
            tfidf_keywords = [k[0] for k in keyword_pairs]
    except Exception:
        pass

    return {
        "technical_skills": tech_skills,
        "soft_skills": soft_skills,
        "tfidf_keywords": tfidf_keywords,
        "all_skill_keys": set(tech_found.keys()).union(set(soft_found.keys())),
    }


# -------------------------------------------------------------
# Experience Level & Fit Evaluation
# -------------------------------------------------------------

def extract_years_of_experience(text: str) -> int:
    """
    Extracts the highest detected years of experience mentioned in the text.
    Matches patterns like '5+ years', '3-5 years of experience', '7 years working as'.
    """
    patterns = [
        r"(\d+)\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|working)?",
        r"(?:experience|worked for)\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)",
    ]
    years_found = []
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for m in matches:
            try:
                val = int(m.group(1))
                if 1 <= val <= 35:
                    years_found.append(val)
            except Exception:
                continue

    return max(years_found) if years_found else 0


def detect_seniority(text: str) -> str:
    """
    Detects seniority markers (Principal, Lead, Senior, Mid, Junior, Entry).
    """
    text_lower = text.lower()
    if re.search(r"\b(principal|architect|director|head of|vp|staff engineer)\b", text_lower):
        return "Principal / Lead"
    if re.search(r"\b(senior|sr\.?|lead developer|lead engineer)\b", text_lower):
        return "Senior"
    if re.search(r"\b(junior|jr\.?|intern|entry level|associate|graduate)\b", text_lower):
        return "Junior / Entry"
    return "Mid-Level"


def evaluate_experience_fit(resume_text: str, jd_text: str) -> Dict[str, Any]:
    """
    Calculates Experience Fit rating ('Strong', 'Moderate', or 'Low').
    """
    resume_years = extract_years_of_experience(resume_text)
    jd_years = extract_years_of_experience(jd_text)

    resume_seniority = detect_seniority(resume_text)
    jd_seniority = detect_seniority(jd_text)

    # Calculate fit
    if jd_years > 0:
        if resume_years >= jd_years:
            rating = "Strong"
            summary = f"Exceeds or matches experience requirement ({resume_years}+ yrs vs {jd_years} yrs required)."
        elif resume_years >= max(1, jd_years - 1):
            rating = "Moderate"
            summary = f"Close to required experience ({resume_years} yrs vs {jd_years} yrs required)."
        else:
            rating = "Low"
            summary = f"Below specified experience requirement ({resume_years} yrs vs {jd_years} yrs required)."
    else:
        # If no explicit years mentioned in JD, evaluate seniority matching
        if resume_seniority == jd_seniority or resume_seniority in ["Senior", "Principal / Lead"]:
            rating = "Strong"
            summary = f"Strong alignment with target role seniority ({resume_seniority})."
        elif resume_seniority == "Mid-Level":
            rating = "Moderate"
            summary = "Demonstrates solid intermediate domain experience."
        else:
            rating = "Moderate"
            summary = "Relevant foundational background detected."

    return {
        "rating": rating,
        "candidate_years_detected": resume_years if resume_years > 0 else None,
        "jd_years_required": jd_years if jd_years > 0 else None,
        "candidate_seniority": resume_seniority,
        "jd_seniority": jd_seniority,
        "summary": summary,
    }


# -------------------------------------------------------------
# Overall ATS NLP Matching Engine
# -------------------------------------------------------------

def analyze_resume_nlp(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Core NLP comparison engine between Resume and Job Description.
    Calculates:
      1. TF-IDF Cosine Similarity.
      2. Skill Coverage & Match ratio.
      3. Matched Keywords list and count (e.g. '12 of 16 matched').
      4. Missing Critical Skills list.
      5. Experience Fit rating ('Strong', 'Moderate', 'Low').
      6. Overall Composite ATS Match Percentage.
    """
    resume_analysis = extract_skills_and_keywords(resume_text)
    jd_analysis = extract_skills_and_keywords(job_description)

    # 1. Cosine Similarity via TF-IDF
    documents = [resume_text, job_description]
    try:
        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=6000)
        tfidf_matrix = vectorizer.fit_transform(documents)
        cosine_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]) * 100.0
        similarity_score = round(min(100.0, max(0.0, cosine_sim)), 1)
    except Exception:
        similarity_score = 50.0

    # 2. Match Skills & Keywords
    resume_keys = resume_analysis["all_skill_keys"]
    jd_keys = jd_analysis["all_skill_keys"]

    matched_tech = []
    missing_tech = []
    for s in jd_analysis["technical_skills"]:
        if s["raw"] in resume_keys:
            matched_tech.append(s)
        else:
            missing_tech.append(s)

    matched_soft = []
    missing_soft = []
    for s in jd_analysis["soft_skills"]:
        if s["raw"] in resume_keys:
            matched_soft.append(s)
        else:
            missing_soft.append(s)

    # If JD didn't specify technical skills, include candidate's detected skills as matched
    if not jd_analysis["technical_skills"]:
        for s in resume_analysis["technical_skills"]:
            matched_tech.append(s)

    # 3. Matched Keywords & Count Summary
    total_jd_keywords = len(jd_keys) if jd_keys else len(matched_tech)
    matched_count = len(matched_tech) + len(matched_soft)

    if total_jd_keywords > 0:
        count_summary = f"{min(matched_count, total_jd_keywords)} of {total_jd_keywords} matched"
        skill_coverage_pct = (min(matched_count, total_jd_keywords) / total_jd_keywords) * 100.0
    else:
        count_summary = f"{len(matched_tech)} skills detected"
        skill_coverage_pct = min(100.0, len(matched_tech) * 10.0)

    # Unified list of matched keyword names
    all_matched_names = [s["name"] for s in matched_tech] + [s["name"] for s in matched_soft]
    # Deduplicate while preserving order
    all_matched_names = list(dict.fromkeys(all_matched_names))

    # Unified list of missing keyword names
    all_missing_names = [s["name"] for s in missing_tech] + [s["name"] for s in missing_soft]
    all_missing_names = list(dict.fromkeys(all_missing_names))

    # 4. Overall ATS Match Score
    # Composite: 40% TF-IDF Semantic Similarity + 60% Keyword & Skills Coverage
    overall_ats_score = round((similarity_score * 0.40) + (skill_coverage_pct * 0.60), 1)
    overall_ats_score = min(100.0, max(0.0, overall_ats_score))

    # 5. Experience Fit
    experience_fit = evaluate_experience_fit(resume_text, job_description)

    return {
        "overall_ats_score": overall_ats_score,
        "similarity_score": similarity_score,
        "skills_coverage_score": round(skill_coverage_pct, 1),
        "matched_keywords": {
            "count_summary": count_summary,
            "matched_count": len(all_matched_names),
            "total_jd_keywords": total_jd_keywords,
            "items": all_matched_names,
        },
        "technical_skills": {
            "matched": [s["name"] for s in matched_tech],
            "missing": [s["name"] for s in missing_tech],
            "details_matched": matched_tech,
            "details_missing": missing_tech,
        },
        "soft_skills": {
            "matched": [s["name"] for s in matched_soft],
            "missing": [s["name"] for s in missing_soft],
            "details_matched": matched_soft,
            "details_missing": missing_soft,
        },
        "missing_critical_skills": all_missing_names,
        "experience_fit": experience_fit,
    }
