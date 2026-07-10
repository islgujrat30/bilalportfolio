import React, { useState } from 'react';

const AIDigestSubscribe = ({ addToRefs }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | loading | success | error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setFormStatus("loading");
    try {
      // Placeholder for GAS Web App URL (will be updated in later phases)
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_PLACEHOLDER/exec";
      
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "subscribe",
          name: formData.name,
          email: formData.email
        }),
      });
      // no-cors doesn't return readable response, assuming success if no error thrown
      setFormStatus("success");
      setFormData({ name: "", email: "" });
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <section id="ai-digest" className="py-[4rem] lg:py-[6rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto">
      <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700">
        
        <div className="glass-card p-[2rem] md:p-[3.5rem] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.6)] relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--color-highlight)] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <p className="text-[var(--color-highlight)] font-['Fira_Code'] text-[0.85rem] tracking-widest uppercase mb-3"><i className="fas fa-robot mr-2"></i>Weekly Automation</p>
              <h2 className="font-['Outfit'] text-[2.5rem] md:text-[3.2rem] font-bold text-[var(--color-primary)] leading-[1.1] mb-4">AI Weekly Digest</h2>
              <p className="text-[var(--color-muted)] text-[1.05rem] leading-[1.7] mb-6">
                Stay ahead of the curve. Get a beautifully curated, AI-generated summary of the week's top Artificial Intelligence news, models, and tools delivered straight to your inbox every Friday.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 mb-6">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-[var(--color-highlight)]"></i>
                  <span className="font-['Outfit'] text-[0.95rem] text-[var(--color-primary)]">100% Automated</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-[var(--color-highlight)]"></i>
                  <span className="font-['Outfit'] text-[0.95rem] text-[var(--color-primary)]">Powered by Gemini</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-[var(--color-highlight)]"></i>
                  <span className="font-['Outfit'] text-[0.95rem] text-[var(--color-primary)]">Spam-free</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[45%]">
              <div className="bg-[rgba(6,11,25,0.7)] p-6 md:p-8 rounded-xl border border-[rgba(255,255,255,0.05)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md">
                {formStatus === 'success' ? (
                  <div className="text-center py-6 animate-fade-in">
                    <div className="w-14 h-14 rounded-full bg-[rgba(100,255,218,0.1)] flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-envelope-open-text text-[var(--color-highlight)] text-[1.5rem]"></i>
                    </div>
                    <h3 className="font-['Outfit'] text-[1.3rem] font-bold text-[var(--color-primary)] mb-2">You're on the list!</h3>
                    <p className="text-[var(--color-muted)] text-[0.95rem] leading-[1.6]">Keep an eye on your inbox this Friday for the first issue.</p>
                    <button onClick={() => setFormStatus('idle')} className="mt-5 text-[var(--color-highlight)] font-['Outfit'] text-[0.9rem] hover:underline transition-all">
                      Subscribe another email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-[var(--color-primary)] font-['Outfit'] text-[0.95rem] placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[var(--color-highlight)] focus:bg-[rgba(100,255,218,0.03)] transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email address *"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-[var(--color-primary)] font-['Outfit'] text-[0.95rem] placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[var(--color-highlight)] focus:bg-[rgba(100,255,218,0.03)] transition-all"
                      />
                    </div>
                    
                    {formStatus === 'error' && (
                      <p className="text-red-400 font-['Outfit'] text-[0.85rem] text-center">Something went wrong. Try again.</p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="w-full py-3 px-6 rounded-lg font-['Outfit'] font-semibold text-[1rem] text-[#0a0a0a] flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_5px_20px_rgba(100,255,218,0.25)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      style={{ background: "linear-gradient(90deg, #c8f04a 0%, #64ffda 100%)" }}
                    >
                      {formStatus === 'loading' ? (
                        <><i className="fas fa-spinner fa-spin"></i> Subscribing...</>
                      ) : (
                        <>Subscribe Now <i className="fas fa-arrow-right text-[0.9rem]"></i></>
                      )}
                    </button>
                    <p className="text-center text-[var(--color-muted)] text-[0.8rem] mt-3 opacity-60">
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default AIDigestSubscribe;
