# A curated dictionary of domain knowledge for specific industries.
# You can easily expand this list later by just adding new dictionary keys.

INDUSTRY_DATA = {
    "Software Engineering": {
        "keywords": [
            "system design", "REST APIs", "microservices", "CI/CD", "Agile", "Scrum",
            "Git", "Docker", "Kubernetes", "cloud computing", "DevOps", "TDD",
            "code review", "version control", "distributed systems", "API design",
            "database design", "load balancing", "caching", "message queues"
        ],
        "certifications": [
            "AWS Certified Developer - Associate",
            "Google Cloud Professional Developer",
            "Certified Kubernetes Administrator (CKA)",
            "Microsoft Azure Developer Associate",
            "HashiCorp Terraform Associate"
        ]
    },
    "Data Science": {
        "keywords": [
            "machine learning", "deep learning", "data analysis", "statistical modeling",
            "Python", "pandas", "NumPy", "scikit-learn", "TensorFlow", "PyTorch",
            "data visualization", "feature engineering", "A/B testing", "SQL",
            "data pipeline", "ETL", "model deployment", "MLOps", "Jupyter"
        ],
        "certifications": [
            "Google Professional Machine Learning Engineer",
            "AWS Certified Machine Learning - Specialty",
            "TensorFlow Developer Certificate",
            "IBM Data Science Professional Certificate",
            "Databricks Certified Associate Developer"
        ]
    },
    "Product Management": {
        "keywords": [
            "product strategy", "roadmap planning", "user research", "A/B testing",
            "Agile", "Scrum", "Go-to-Market (GTM)", "stakeholder management",
            "data analysis", "KPI tracking", "Jira", "wireframing", "competitive analysis",
            "product lifecycle", "user stories", "cross-functional leadership"
        ],
        "certifications": [
            "Certified Scrum Product Owner (CSPO)",
            "Pragmatic Institute Certified (PMC)",
            "AIPMM Certified Product Manager",
            "PMI Agile Certified Practitioner (PMI-ACP)"
        ]
    }
}

def get_industry_data(industry_name: str) -> dict:
    """
    Returns the keywords and certifications for a given industry.
    If the industry isn't found, it safely returns empty lists.
    """
    if not industry_name:
        return {"keywords": [], "certifications": []}
        
    # Make it case-insensitive and trim whitespace
    clean_name = industry_name.strip().lower()
    
    for key, data in INDUSTRY_DATA.items():
        if key.lower() == clean_name:
            return data
            
    # Fallback if industry is completely unknown
    return {"keywords": [], "certifications": []}

def list_supported_industries() -> list:
    """Returns a list of all industry names we currently support."""
    return list(INDUSTRY_DATA.keys())



