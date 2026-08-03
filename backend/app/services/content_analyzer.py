def get_section_word_count(section_name: str, resume_data: dict) -> int:
    """Helper to extract text from the structured resume dict and count words."""
    text = ""
    
    if section_name == "summary":
        text = resume_data.get("summary", "")
        
    elif section_name == "skills":
        text = " ".join(resume_data.get("skills", []))
        
    elif section_name == "experience":
        for exp in resume_data.get("experience", []):
            text += f" {exp.get('title', '')} {exp.get('company', '')} {exp.get('description', '')}"
            
    elif section_name == "projects":
        for proj in resume_data.get("projects", []):
            techs = " ".join(proj.get("technologies", []))
            text += f" {proj.get('name', '')} {techs} {proj.get('description', '')}"
            
    elif section_name == "education":
        for edu in resume_data.get("education", []):
            text += f" {edu.get('degree', '')} {edu.get('institution', '')}"
            
    # Split by whitespace and count
    return len(text.split())

def analyze_content(resume_text: str, resume_data: dict) -> dict:
    """
    Analyzes word counts for each section against ATS target ranges.
    Returns a score and status for each section.
    """
    # Industry-researched ideal word counts per section
    TARGETS = {
        "summary": {"min": 30, "max": 80, "target_label": "30-80 words"},
        "skills": {"min": 10, "max": 50, "target_label": "10-50 words"},
        "experience": {"min": 80, "max": 300, "target_label": "80-300 words"},
        "projects": {"min": 40, "max": 200, "target_label": "40-200 words"},
        "education": {"min": 15, "max": 60, "target_label": "15-60 words"}
    }

    sections_result = {}
    good_sections_count = 0
    total_evaluated = 0

    for section, rules in TARGETS.items():
        word_count = get_section_word_count(section, resume_data)
        
        # If the section is totally empty, we skip scoring it here 
        # (the formatting checker already penalized them for missing sections)
        if word_count == 0:
            continue
            
        total_evaluated += 1
        
        if word_count < rules["min"]:
            status = "too_short"
        elif word_count > rules["max"]:
            status = "too_long"
        else:
            status = "good"
            good_sections_count += 1
            
        sections_result[section] = {
            "word_count": word_count,
            "status": status,
            "target": rules["target_label"]
        }

    # Calculate score as a percentage of sections that are in the "good" range
    score = 100
    if total_evaluated > 0:
        score = int((good_sections_count / total_evaluated) * 100)

    return {
        "score": score,
        "total_words": len(resume_text.split()),
        "sections": sections_result
    }

