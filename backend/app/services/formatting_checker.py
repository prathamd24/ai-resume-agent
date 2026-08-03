import re

def check_formatting(resume_text: str) -> dict:
    """
    Checks the raw resume text for ATS-friendly formatting and standard sections.
    Returns a dictionary with a score, found sections, missing sections, and issues.
    """
    # 1. Define the sections we want to look for (using regex to catch variations)
    section_patterns = {
        "SUMMARY": r"(?i)\b(summary|professional summary|objective|about me)\b",
        "EXPERIENCE": r"(?i)\b(experience|work experience|employment|professional experience)\b",
        "EDUCATION": r"(?i)\b(education|academic background|academics)\b",
        "SKILLS": r"(?i)\b(skills|technical skills|core competencies)\b",
        "PROJECTS": r"(?i)\b(projects|portfolio|personal projects)\b",
        "CERTIFICATIONS": r"(?i)\b(certifications|awards|licenses)\b"
    }

    sections_found = []
    missing_sections = []
    
    # Check which sections exist in the text
    for section_name, pattern in section_patterns.items():
        if re.search(pattern, resume_text):
            sections_found.append(section_name)
        else:
            missing_sections.append(section_name)

    # 2. Check for Formatting Red Flags
    issues = []
    
    # Check for heavy use of tables/columns (pipes)
    if resume_text.count('|') > 5:
        issues.append("Detected multiple pipe (|) characters. Tables and multi-column layouts often break ATS parsers.")
    
    # Add issues for important missing sections
    if "EXPERIENCE" in missing_sections:
        issues.append("Critical section missing: EXPERIENCE. ATS systems expect a clear work history.")
    if "EDUCATION" in missing_sections:
        issues.append("Critical section missing: EDUCATION.")
    if "SUMMARY" in missing_sections:
        issues.append("Consider adding a Professional SUMMARY at the top to highlight your core value.")

    # 3. Calculate Score (0-100)
    score = 100
    
    # Deduct 10 points for every missing standard section
    score -= len(missing_sections) * 10
    
    # Deduct 15 points for structural red flags (like pipes)
    if resume_text.count('|') > 5:
        score -= 15
            
    # Ensure score stays between 0 and 100
    score = max(0, min(100, score))

    return {
        "score": score,
        "sections_found": sections_found,
        "missing_sections": missing_sections,
        "issues": issues
    }


