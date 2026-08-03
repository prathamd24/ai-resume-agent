from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from parsers.pdf_parser import extract_text_from_pdf
from services.formatting_checker import check_formatting
from services.content_analyzer import analyze_content
from services.industry_data import get_industry_data
from ai.resume_analyzer import analyze_resume
from ai.checker_analyzer import analyze_for_checker
import tempfile
import os
import traceback

router = APIRouter()

@router.post("/check")
def run_ats_checker(
    resume: UploadFile = File(...),
    jd_text: str = Form(...),
    industry: Optional[str] = Form(None)
):
    """
    The ultimate ATS pipeline. Takes a PDF and JD, runs all checks, 
    and returns a combined JSON report.
    """
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported currently.")
        
    temp_path = ""
    try:
        
        # Security Check: Reject files larger than 5 Megabytes
        if resume.size > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
            
        file_bytes = resume.file.read()
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file_bytes)
            temp_path = tmp.name

            
        # 2. Extract Text
        resume_text = extract_text_from_pdf(temp_path)
        
        # 3. Pure Python Check: Formatting
        formatting_result = check_formatting(resume_text)
        
        # 4. Get structured resume data (needed for word counts)
        resume_data = analyze_resume(resume_text)
        
        # 5. Pure Python Check: Content Length
        content_result = analyze_content(resume_text, resume_data)
        
        # 6. The Massive AI Semantic Check
        semantic_result = analyze_for_checker(resume_data, jd_text, industry)

        
        # 7. Recommended Certifications
        certifications = []
        if industry:
            ind_data = get_industry_data(industry)
            certifications = ind_data.get("certifications", [])
            
        # 8. Merge everything into one giant report
        return {
            "candidate_profile": resume_data,
            "formatting": formatting_result,
            "content_length": content_result,
            "semantic_analysis": semantic_result,
            "recommended_certifications": certifications
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
