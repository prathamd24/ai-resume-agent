import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { CheckerResponse } from '../api';

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    
    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplayed(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 10);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);
  return <span>{displayed}</span>;
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as CheckerResponse;

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  const [animatedScores, setAnimatedScores] = useState({ formatting: 0, content: 0, keywords: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      if (result) {
        setAnimatedScores({
          formatting: result.formatting.score,
          content: result.content_length.score,
          keywords: result.semantic_analysis.keyword_analysis.keyword_match_score,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [result]);

  if (!result) {
    // If someone visits /dashboard directly without uploading, redirect to home
    return <Navigate to="/" />;
  }

  const {
    formatting,
    content_length,
    semantic_analysis,
    recommended_certifications,
  } = result;

  const {
    keyword_analysis,
    action_verbs,
    skills,
    suggestions_for_improvement,
    optimized_resume,
    industry_analysis,
  } = semantic_analysis;

  // Helper to calculate stroke dash offset for SVG circles (circumference = 175)
  const calculateOffset = (score: number) => {
    return 175 - (175 * score) / 100;
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16 z-50 backdrop-blur-md border-b border-white/10 shadow-[0_0_15px_rgba(221,183,255,0.2)] bg-surface/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
          <h1 className="font-headline-md text-body-lg md:text-headline-md font-bold text-primary tracking-wide">CareerCopilot</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-all active:scale-95 border border-white/10"
          >
            <span className="material-symbols-outlined text-sm" data-icon="home">home</span>
            <span className="font-body-md text-on-surface">Home</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-24 px-container-padding-mobile md:px-container-padding-desktop pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto space-y-section-gap">
          {/* Metric Cards Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Formatting Score */}
            <div className="glass-card p-6 rounded-xl flex items-center justify-between neon-glow-purple group hover:scale-[1.02] transition-transform animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <div>
                <h3 className="font-headline-md text-body-lg text-on-surface-variant mb-1">Formatting Score</h3>
                <p className="font-label-sm text-label-sm text-tertiary">Professional standard</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" fill="transparent" r="28" stroke="#262626" strokeWidth="4"></circle>
                  <circle className="transition-all duration-[1500ms] ease-out" cx="32" cy="32" fill="transparent" r="28" stroke="#4cd7f6" strokeDasharray="175" strokeDashoffset={calculateOffset(animatedScores.formatting)} strokeWidth="4"></circle>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-label-sm text-tertiary">{animatedScores.formatting}%</span>
              </div>
            </div>
            {/* Content Length Score */}
            <div className="glass-card p-6 rounded-xl flex items-center justify-between border-error/20 hover:scale-[1.02] transition-transform animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <div>
                <h3 className="font-headline-md text-body-lg text-on-surface-variant mb-1">Content Length</h3>
                <p className="font-label-sm text-label-sm text-error">{content_length.score < 50 ? 'Needs major work' : 'Optimal length'}</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" fill="transparent" r="28" stroke="#262626" strokeWidth="4"></circle>
                  <circle className="transition-all duration-[1500ms] ease-out" cx="32" cy="32" fill="transparent" r="28" stroke="#ffb4ab" strokeDasharray="175" strokeDashoffset={calculateOffset(animatedScores.content)} strokeWidth="4"></circle>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-label-sm text-error">{animatedScores.content}%</span>
              </div>
            </div>
            {/* Keyword Match */}
            <div className="glass-card p-6 rounded-xl flex items-center justify-between neon-glow-blue hover:scale-[1.02] transition-transform animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
              <div>
                <h3 className="font-headline-md text-body-lg text-on-surface-variant mb-1">Keyword Match</h3>
                <p className="font-label-sm text-label-sm text-secondary">Target Job alignment</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" fill="transparent" r="28" stroke="#262626" strokeWidth="4"></circle>
                  <circle className="transition-all duration-[1500ms] ease-out" cx="32" cy="32" fill="transparent" r="28" stroke="#adc6ff" strokeDasharray="175" strokeDashoffset={calculateOffset(animatedScores.keywords)} strokeWidth="4"></circle>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-label-sm text-secondary">{animatedScores.keywords}%</span>
              </div>
            </div>
          </section>

          {/* Bento Grid: Keywords & AI Insights */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Keyword Analysis Card */}
            <div className="lg:col-span-2 glass-card rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary" data-icon="troubleshoot">troubleshoot</span>
                <h2 className="font-headline-md text-headline-md">Keyword Analysis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Matched */}
                <div className="flex flex-col h-full">
                  <h4 className="font-label-sm text-label-sm text-tertiary mb-4 uppercase tracking-widest">Matched Keywords ({keyword_analysis.matched_keywords.length})</h4>
                  <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {keyword_analysis.matched_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full border border-tertiary/30 bg-tertiary/10 text-xs text-tertiary">{kw}</span>
                    ))}
                  </div>
                </div>
                {/* Missing */}
                <div className="flex flex-col h-full">
                  <h4 className="font-label-sm text-label-sm text-error mb-4 uppercase tracking-widest">Missing Keywords ({keyword_analysis.missing_keywords.length})</h4>
                  <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {keyword_analysis.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full border border-error/30 bg-error/10 text-xs text-error">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions Card */}
            <div className="glass-card rounded-xl p-6 md:p-8 border-l-4 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full"></div>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
                <h2 className="font-headline-md text-headline-md">AI Insights</h2>
              </div>
              <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {suggestions_for_improvement.map((suggestion, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="material-symbols-outlined text-primary text-sm mt-1" data-icon="check_circle">check_circle</span>
                    <p className="font-body-md text-on-surface-variant">{suggestion}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Action to Optimize */}
          {!showOptimized && !isOptimizing && (
            <div className="flex justify-center py-12 animate-fade-in">
              <button 
                onClick={() => {
                  setIsOptimizing(true);
                  setTimeout(() => {
                    setIsOptimizing(false);
                    setShowOptimized(true);
                  }, Math.floor(Math.random() * 5000) + 5000); // 5-10 seconds
                }}
                className="group relative px-8 py-4 bg-primary text-on-primary rounded-full font-headline-md font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(221,183,255,0.3)] hover:shadow-[0_0_40px_rgba(221,183,255,0.6)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="material-symbols-outlined relative z-10 animate-pulse" data-icon="magic_button">magic_button</span>
                <span className="relative z-10">Optimize Resume Now</span>
              </button>
            </div>
          )}

          {isOptimizing && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 transition-all duration-500 ease-in-out opacity-100">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-primary font-headline-md animate-pulse">Building Optimized Resume...</p>
              <p className="text-on-surface-variant font-body-md italic text-center max-w-sm">Applying AI enhancements, rewriting experience, and aligning with target industry...</p>
            </div>
          )}

          {/* Hidden content that reveals after optimizing */}
          <div className={`space-y-section-gap transition-all duration-1000 ease-out ${showOptimized ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-10 hidden'}`}>
            {/* Hero Resume Section */}
            <section className="glass-card rounded-2xl overflow-hidden shadow-2xl border-white/5 relative">
            <div className="bg-surface-container/50 px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-error/40"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary/40"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                </div>
                <span className="font-headline-md text-body-lg font-semibold">Optimized Resume</span>
              </div>
            </div>
            
            <div className="p-6 md:p-12 bg-[#171717] min-h-[400px]">
              <div className="max-w-3xl mx-auto space-y-12 relative">
                <div className="absolute w-[2px] h-full bg-primary/20 left-0 -translate-x-1 translate-y-1"></div>
                
                {/* Summary */}
                <div>
                  <h2 className="font-headline-md text-headline-md text-primary mb-4 border-b border-white/5 pb-2">Optimized Summary</h2>
                  <p className="font-body-lg text-on-surface-variant leading-relaxed min-h-[4rem]">
                    {showOptimized && <TypewriterText text={optimized_resume.summary} delay={200} />}
                  </p>
                </div>
                
                {/* Experience */}
                <div>
                  <h2 className="font-headline-md text-headline-md text-primary mb-4 border-b border-white/5 pb-2">Rewritten Experience</h2>
                  <div className="space-y-8">
                    {optimized_resume.experience.map((exp, i) => (
                      <div key={i}>
                        <h3 className="font-body-lg font-bold text-on-surface mb-3 min-h-[1.5rem]">
                          {showOptimized && <TypewriterText text={`${exp.title} at ${exp.company}`} delay={500 + i * 300} />}
                        </h3>
                        <div className="space-y-4">
                          {exp.optimized_bullet_points.map((bullet, j) => (
                            <div key={j} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                              <p className="font-body-md text-on-surface-variant min-h-[1.5rem]">
                                {showOptimized && <TypewriterText text={bullet} delay={800 + i * 300 + j * 150} />}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Industry & ATS Extraneous sections */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-4xl" data-icon="analytics">analytics</span>
              <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Deep-Dive & Enhancements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              
              {/* Industry Keywords */}
              {industry_analysis && (
                <div className="md:col-span-1 lg:col-span-1 glass-card rounded-xl p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-tertiary" data-icon="key">key</span>
                    <h3 className="font-headline-md text-headline-md">Industry Specific</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div>
                      <h4 className="font-label-sm text-tertiary mb-4 uppercase tracking-widest">Matched</h4>
                      <div className="flex flex-wrap gap-2">
                        {industry_analysis.matched_industry_keywords.slice(0, 10).map((kw, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 rounded-full border border-tertiary/40 bg-tertiary/10 text-tertiary font-label-sm animate-fade-in"
                            style={{ animationDelay: `${1000 + i * 100}ms`, animationFillMode: 'both' }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-label-sm text-primary mb-4 uppercase tracking-widest">Suggested</h4>
                      <div className="flex flex-wrap gap-2">
                        {industry_analysis.suggested_industry_keywords.slice(0, 10).map((kw, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary font-label-sm animate-fade-in"
                            style={{ animationDelay: `${1500 + i * 100}ms`, animationFillMode: 'both' }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Found */}
              <div className="glass-card rounded-xl p-8 border-t-4 border-secondary h-full">
                <h3 className="font-headline-md text-headline-md mb-6">Skills Found</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <ul className="space-y-3">
                    {skills.skills_found.map((s, i) => (
                      <li 
                        key={i} 
                        className="flex items-center gap-3 text-on-surface-variant font-body-md animate-fade-in"
                        style={{ animationDelay: `${2000 + i * 100}ms`, animationFillMode: 'both' }}
                      >
                        <span className="material-symbols-outlined text-secondary text-base bg-secondary/10 p-1 rounded-full" data-icon="check">check</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills To Add */}
              <div className="glass-card rounded-xl p-8 border-t-4 border-error h-full">
                <h3 className="font-headline-md text-headline-md mb-6">Skills To Add</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <ul className="space-y-3">
                    {skills.skills_to_add.map((s, i) => (
                      <li 
                        key={i} 
                        className="flex items-center gap-3 text-on-surface-variant font-body-md opacity-90 animate-fade-in"
                        style={{ animationDelay: `${2500 + i * 100}ms`, animationFillMode: 'both' }}
                      >
                        <span className="material-symbols-outlined text-error text-base bg-error/10 p-1 rounded-full" data-icon="add">add</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Verbs */}
              <div className="glass-card rounded-xl p-8 border-r-4 border-tertiary h-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-tertiary" data-icon="bolt">bolt</span>
                  <h3 className="font-headline-md text-headline-md">Action Verbs</h3>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                    <p className="text-[10px] uppercase text-error/60 font-bold tracking-tighter mb-1">Found ({action_verbs.verbs_found.length})</p>
                    <p className="font-body-md text-on-surface min-h-[1.5rem]">
                      {showOptimized && <TypewriterText text={action_verbs.verbs_found.join(', ') || 'None found'} delay={3000} />}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-tertiary/10 border border-tertiary/20">
                    <p className="text-[10px] uppercase text-tertiary/60 font-bold tracking-tighter mb-1">To Use</p>
                    <p className="font-headline-md text-body-lg text-tertiary min-h-[2rem]">
                      {showOptimized && <TypewriterText text={action_verbs.powerful_verbs_to_use.slice(0,5).join(', ')} delay={3500} />}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Certifications (if any) */}
              {recommended_certifications.length > 0 && (
                <div className="glass-card rounded-xl p-8 neon-glow-purple border-l-4 border-primary h-full lg:col-span-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary" data-icon="workspace_premium">workspace_premium</span>
                    <h3 className="font-headline-md text-headline-md">Recommended Certifications</h3>
                  </div>
                  <p className="font-label-sm text-on-surface-variant mb-6 italic">Boost your ATS score by adding these if you have them</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommended_certifications.map((cert, i) => (
                      <li key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                        <p className="font-body-md text-on-surface">{cert}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
          </div>
        </div>
      </main>
    </div>
  );
}
