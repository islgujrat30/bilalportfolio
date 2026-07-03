import React from 'react';

const skills = [
  "React Native", "HTML", "CSS", "JavaScript", "Python", "PHP", "Tailwind CSS", "C++",
  "ElevenLabs", "OpenAI", "Google AI Studio", "Canva", "Git", "GitHub", "VS Code",
  "Antigravity", "Codex", "MySQL", "Firebase", "Cloudflare", "Bootstrap", "Gemini", 
  "Claude", "Claude Code"
];

const TechStack = ({ addToRefs }) => {
  return (
    <section id="techstack" className="py-[4rem] lg:py-[6rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto">
      <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700 relative z-10">
        <div className="glass-card p-[2.5rem] md:p-[3.5rem] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.6)]">
          <h3 className="font-['Outfit'] text-[1.8rem] font-bold text-[var(--color-primary)] mb-8">
            Tech Stack
          </h3>
          
          <div className="flex flex-wrap gap-4">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="font-['Outfit'] text-[0.95rem] md:text-[1rem] font-medium text-[var(--color-primary)] px-5 py-2.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
