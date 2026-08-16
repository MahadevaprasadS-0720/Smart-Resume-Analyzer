import re
from typing import List


def clean_text(text: str) -> str:
    """
    Cleans and normalizes extracted resume and job description text.
    Removes excessive whitespace, non-standard unicode characters, and converts spacing.
    """
    if not text:
        return ""
    # Replace non-breaking spaces and irregular whitespace
    text = re.sub(r"[\xa0\u200b\u200e\u200f]", " ", text)
    # Remove bullet symbols or convert them to standard dash
    text = re.sub(r"[•●▪■◆★►✓✔\t]+", " ", text)
    # Normalize multiple newlines and spaces
    text = re.sub(r"\r\n|\r", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_emails(text: str) -> List[str]:
    """
    Extracts email addresses from text using regex.
    """
    pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    matches = re.findall(pattern, text)
    # Return unique emails while preserving order
    return list(dict.fromkeys(matches))


def extract_phone_numbers(text: str) -> List[str]:
    """
    Extracts phone numbers from text using regex pattern matching.
    """
    pattern = r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
    matches = re.findall(pattern, text)
    return list(dict.fromkeys([m.strip() for m in matches if len(re.sub(r"\D", "", m)) >= 10]))


def extract_links(text: str) -> List[str]:
    """
    Extracts URLs, LinkedIn, and GitHub profile links from text.
    """
    pattern = r"(?:https?://(?:www\.)?|www\.)[a-zA-Z0-9./\-_#]+"
    matches = re.findall(pattern, text)
    # Also find linkedin.com/in/... or github.com/...
    profile_pattern = r"(?:linkedin\.com/in/[a-zA-Z0-9_-]+|github\.com/[a-zA-Z0-9_-]+)"
    profile_matches = re.findall(profile_pattern, text, re.IGNORECASE)
    all_links = matches + profile_matches
    return list(dict.fromkeys(all_links))
