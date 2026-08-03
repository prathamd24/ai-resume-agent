from pydantic import BaseModel
from typing import List, Optional

class KeywordAnalysis(BaseModel):
    matched_keywords: List[str]
    missing_keywords: List[str]
    keyword_match_score: int

class ActionVerbs(BaseModel):
    verbs_found: List[str]
    powerful_verbs_to_use: List[str]

class Skills(BaseModel):
    skills_found: List[str]
    skills_to_add: List[str]

class OptimizedExperience(BaseModel):
    title: str
    company: str
    optimized_bullet_points: List[str]

class OptimizedResume(BaseModel):
    summary: str
    experience: List[OptimizedExperience]

class IndustryAnalysis(BaseModel):
    industry_keyword_match_score: int
    matched_industry_keywords: List[str]
    suggested_industry_keywords: List[str]
    industry_aware_suggestions: List[str]

# This is the master schema that wraps everything together!
class CheckerResponseSchema(BaseModel):
    keyword_analysis: KeywordAnalysis
    action_verbs: ActionVerbs
    skills: Skills
    suggestions_for_improvement: List[str]
    optimized_resume: OptimizedResume
    industry_analysis: Optional[IndustryAnalysis] = None

class ContactInfo(BaseModel):
    email: str
    phone: str
    linkedin: str
    github: str

class Project(BaseModel):
    name: str
    technologies: List[str]
    description: str

class Education(BaseModel):
    degree: str
    institution: str
    year: str

class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: str

class ResumeSchema(BaseModel):
    name: str
    contact: ContactInfo
    summary: str
    skills: List[str]
    projects: List[Project]
    education: List[Education]
    experience: List[Experience]
    certifications: List[str]
