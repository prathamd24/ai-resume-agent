export interface FormattingResult {
  score: number;
  sections_found: string[];
  missing_sections: string[];
  issues: string[];
}

export interface SectionContentResult {
  word_count: number;
  status: 'good' | 'too_short' | 'too_long';
  target: string;
}

export interface ContentLengthResult {
  score: number;
  total_words: number;
  sections: Record<string, SectionContentResult>;
}

export interface KeywordAnalysis {
  matched_keywords: string[];
  missing_keywords: string[];
  keyword_match_score: number;
}

export interface ActionVerbs {
  verbs_found: string[];
  powerful_verbs_to_use: string[];
}

export interface Skills {
  skills_found: string[];
  skills_to_add: string[];
}

export interface OptimizedExperience {
  title: string;
  company: string;
  optimized_bullet_points: string[];
}

export interface OptimizedResume {
  summary: string;
  experience: OptimizedExperience[];
}

export interface IndustryAnalysis {
  industry_keyword_match_score: number;
  matched_industry_keywords: string[];
  suggested_industry_keywords: string[];
  industry_aware_suggestions: string[];
}

export interface SemanticAnalysis {
  keyword_analysis: KeywordAnalysis;
  action_verbs: ActionVerbs;
  skills: Skills;
  suggestions_for_improvement: string[];
  optimized_resume: OptimizedResume;
  industry_analysis?: IndustryAnalysis;
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface Project {
  name: string;
  technologies: string[];
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface CandidateProfile {
  name: string;
  contact: ContactInfo;
  summary: string;
  skills: string[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
  certifications: string[];
}

export interface CheckerResponse {
  candidate_profile: CandidateProfile;
  formatting: FormattingResult;
  content_length: ContentLengthResult;
  semantic_analysis: SemanticAnalysis;
  recommended_certifications: string[];
}

// Uses the production URL if deployed, otherwise falls back to your local server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';


export async function analyzeResume(file: File, jdText: string, industry: string): Promise<CheckerResponse> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jd_text', jdText);
  if (industry) {
    formData.append('industry', industry);
  }

  const response = await fetch(`${API_BASE_URL}/check`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Failed to analyze resume');
  }

  return response.json();
}
