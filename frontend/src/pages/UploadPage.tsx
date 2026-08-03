import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload your PDF resume first.');
      return;
    }
    if (!jdText.trim()) {
      setError('Please provide a target job description.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await analyzeResume(file, jdText, industry);
      
      // Navigate to dashboard and pass the response data
      navigate('/dashboard', { state: { result: response } });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full bg-surface/10 backdrop-blur-xl flex items-center px-container-padding-mobile md:px-12 h-16 z-50 border-b border-white/10 shadow-[0_0_15px_rgba(221,183,255,0.2)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
          <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">CareerCopilot</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 md:px-12 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <section className="mb-section-gap text-center relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Resume Optimizer</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto">Optimize your resume for the ATS in seconds using advanced AI analysis. Land more interviews by aligning your experience with the job description.</p>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-error-container/20 border border-error/50 text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p className="font-body-md text-body-md">{error}</p>
          </div>
        )}

        {/* Grid Layout for Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter items-stretch">
          {/* Upload Zone */}
          <div className="lg:col-span-1 h-full">
            <div className="glass-card rounded-xl p-6 md:p-8 h-full flex flex-col">
              <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">upload_file</span>
                Upload Resume
              </h3>
              
              <div 
                className="neon-border-pulse rounded-xl flex-grow flex flex-col items-center justify-center p-8 cursor-pointer group bg-white/5 min-h-[320px]"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  className="hidden" 
                  id="resume-upload" 
                  type="file" 
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    {file ? 'draft' : 'cloud_upload'}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-center mb-2 text-primary font-bold">
                  {file ? file.name : 'Click to select your PDF resume'}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Max file size: 5MB</p>
              </div>
            </div>
          </div>

          {/* Job Description & Industry */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-6 md:p-8 flex flex-col h-full">
              <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">work_history</span>
                Target Job
              </h3>
              
              <div className="mb-6">
                <label className="font-label-sm text-label-sm block mb-2 text-on-surface-variant uppercase">Target Industry</label>
                <div className="relative group">
                  <select 
                    className="w-full bg-surface-container-highest/50 border border-white/10 rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-primary/50 transition-colors font-body-md"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option disabled value="">Select Target Industry</option>
                    <option value="Tech & Software Engineering">Tech & Software Engineering</option>
                    <option value="Finance & Fintech">Finance & Fintech</option>
                    <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                    <option value="Creative Arts & Design">Creative Arts & Design</option>
                    <option value="Legal & Professional Services">Legal & Professional Services</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                </div>
              </div>
              
              <div className="flex-grow">
                <label className="font-label-sm text-label-sm block mb-2 text-on-surface-variant uppercase">Paste Job Description</label>
                <textarea 
                  className="w-full bg-surface-container-highest/50 border border-white/10 rounded-lg p-4 h-[calc(100%-2rem)] min-h-[240px] lg:min-h-0 focus:outline-none focus:border-primary/50 transition-colors custom-scrollbar resize-none font-body-md" 
                  placeholder="Paste the full job description here to help CareerCopilot align your resume..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="mt-section-gap flex flex-col items-center">
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className={`${loading ? 'opacity-70 cursor-not-allowed' : 'animate-pulse-glow active:scale-95'} w-full md:w-auto md:min-w-[400px] py-5 px-12 bg-gradient-to-r from-primary-container to-secondary-container rounded-full text-on-primary-container font-headline-md text-headline-md flex items-center justify-center gap-3 transition-all`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Analyzing with AI...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Analyze Resume
              </>
            )}
          </button>
          
          <p className="mt-6 font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            AI-Powered ATS Scanning & Scoring
          </p>
        </div>
      </main>
    </div>
  );
}
