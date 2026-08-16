import re
from typing import List, Dict, Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Comprehensive taxonomy of skills across Tech, Data, Cloud, and Soft Skills
SKILL_TAXONOMY: Dict[str, List[str]] = {
    "Programming Languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "golang",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "dart", "sql", "html", "css"
    ],
    "Frameworks & Libraries": [
        "react", "react.js", "next.js", "vue", "vue.js", "angular", "node.js", "express",
        "fastapi", "flask", "django", "spring boot", "asp.net", "tailwind", "tailwind css",
        "bootstrap", "framer motion", "redux", "graphql", "rest api"
    ],
    "AI & Machine Learning": [
        "machine learning", "deep learning", "nlp", "natural language processing",
        "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn", "spacy",
        "huggingface", "llm", "large language models", "generative ai", "langchain",
        "pandas", "numpy", "opencv"
    ],
    "Cloud & DevOps": [
        "aws", "amazon web services", "azure", "microsoft azure", "gcp", "google cloud",
        "docker", "kubernetes", "k8s", "terraform", "ansible", "ci/cd", "jenkins",
        "github actions", "gitlab ci", "linux", "bash", "nginx", "serverless"
    ],
    "Databases & Storage": [
        "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch",
        "dynamodb", "sqlite", "cassandra", "oracle", "mariadb", "firebase", "supabase"
    ],
    "Soft Skills & Leadership": [
        "agile", "scrum", "leadership", "communication", "problem solving",
        "project management", "critical thinking", "teamwork", "collaboration",
        "cross-functional", "time management", "mentorship", "adaptability"
    ],
    "Tools & Platforms": [
        "git", "github", "gitlab", "jira", "confluence", "figma", "postman", "vite",
        "webpack", "jest", "pytest", "cypress", "power bi", "tableau"
    ]
}


def get_flattened_skills() -> Dict[str, str]:
    """Returns a lookup dictionary mapping lowercase skill names to their category."""
    lookup = {}
    for category, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            lookup[skill.lower()] = category
    return lookup


SKILL_LOOKUP = get_flattened_skills()


def extract_skills(text: str) -> Dict[str, Set[str]]:
    """
    Extracts matched skills from text categorized by taxonomy.
    """
    text_lower = f" {text.lower()} "
    # Normalize punctuation for skill boundary search
    normalized = re.sub(r"[^\w\s\+\#\.\/\-]", " ", text_lower)
    
    found_skills: Dict[str, Set[str]] = {cat: set() for cat in SKILL_TAXONOMY.keys()}

    for skill, category in SKILL_LOOKUP.items():
        # Escape special regex characters like c++, .net, c#
        escaped_skill = re.escape(skill)
        pattern = rf"(?:\b|\s){escaped_skill}(?:\b|\s)"
        if re.search(pattern, normalized):
            found_skills[category].add(skill.title() if len(skill) > 3 else skill.upper())

    return {cat: skills for cat, skills in found_skills.items() if skills}


def calculate_similarity(resume_text: str, job_description: str) -> float:
    """
    Calculates TF-IDF Cosine Similarity between resume text and job description.
    Returns percentage score between 0.0 and 100.0.
    """
    if not resume_text.strip() or not job_description.strip():
        return 0.0

    documents = [resume_text, job_description]
    try:
        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
        tfidf_matrix = vectorizer.fit_transform(documents)
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = float(similarity_matrix[0][0]) * 100.0
        return round(min(100.0, max(0.0, score)), 1)
    except Exception:
        # Fallback keyword overlap ratio if TF-IDF encounter issue
        resume_words = set(resume_text.lower().split())
        jd_words = set(job_description.lower().split())
        if not jd_words:
            return 0.0
        overlap = resume_words.intersection(jd_words)
        ratio = (len(overlap) / len(jd_words)) * 100.0
        return round(min(100.0, max(0.0, ratio)), 1)


def extract_keywords(text: str, top_n: int = 15) -> List[Tuple[str, float]]:
    """
    Extracts top keywords using Scikit-Learn TF-IDF scores.
    """
    if not text.strip():
        return []
    try:
        vectorizer = TfidfVectorizer(stop_words="english", max_features=top_n)
        matrix = vectorizer.fit_transform([text])
        feature_names = vectorizer.get_feature_names_out()
        scores = matrix.toarray()[0]
        keywords = [(feature_names[i], round(float(scores[i]), 2)) for i in range(len(feature_names))]
        keywords.sort(key=lambda x: x[1], reverse=True)
        return keywords
    except Exception:
        return []
