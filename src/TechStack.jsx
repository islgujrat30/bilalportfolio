import React, { useEffect, useRef, useCallback } from 'react';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const skills = [
  "React Native", "HTML", "CSS", "JS", "Python", "PHP", "Tailwind", "C++"
];

const TechStack = ({ addToRefs }) => {
  const containerRef = useRef(null);
  const bubblesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const bubbles = bubblesRef.current;
    if (!bubbles.length || !containerRef.current) return;

    const physicsBubbles = bubbles.map((el) => {
      let x = Math.random() * (containerRef.current.clientWidth - 110);
      let y = Math.random() * (containerRef.current.clientHeight - 110);
      return {
        el,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: el.offsetWidth / 2 || 55,
      }
    });

    let animationFrame;

    const animate = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      physicsBubbles.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;

        if (b.x <= 0) { b.x = 0; b.vx *= -1; }
        if (b.x + b.radius * 2 >= containerWidth) { b.x = containerWidth - b.radius * 2; b.vx *= -1; }
        if (b.y <= 0) { b.y = 0; b.vy *= -1; }
        if (b.y + b.radius * 2 >= containerHeight) { b.y = containerHeight - b.radius * 2; b.vy *= -1; }

        const dx = (b.x + b.radius) - mouseRef.current.x;
        const dy = (b.y + b.radius) - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const repulsionRadius = 180;
        if (dist < repulsionRadius && dist > 0) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          b.vx += (dx / dist) * force * 0.8;
          b.vy += (dy / dist) * force * 0.8;
        }

        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > 5) {
          b.vx *= 0.95;
          b.vy *= 0.95;
        } else if (speed < 0.8) {
          b.vx *= 1.05;
          b.vy *= 1.05;
        }

        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      });

      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  return (
    <section id="techstack" className="py-[6rem] lg:py-[8rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto">
      <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700 relative z-10">
        <div className="flex items-center mb-12 transition-all duration-700 ease-out">
          <h2 className="font-['Outfit'] text-[2.2rem] font-bold text-[var(--color-primary)]">My Tech Stack</h2>
          <div className="h-[1px] flex-grow max-w-[250px] ml-5 bg-[rgba(255,255,255,0.1)]"></div>
        </div>

        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[500px] rounded-xl overflow-hidden glass-card border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.4)]"
        >
          <Particles
            id="tsparticles"
            init={particlesInit}
            className="absolute inset-0 z-0 pointer-events-none"
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              interactivity: {
                events: { onHover: { enable: false }, onClick: { enable: false } },
              },
              particles: {
                color: { value: "#64ffda" },
                links: { color: "#64ffda", distance: 120, enable: true, opacity: 0.2, width: 1 },
                move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 0.8, straight: false },
                number: { density: { enable: true, area: 800 }, value: 40 },
                opacity: { value: 0.4 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {skills.map((skill, index) => (
              <div
                key={index}
                ref={(el) => (bubblesRef.current[index] = el)}
                className="absolute top-0 left-0 flex items-center justify-center w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] pointer-events-none"
              >
                <span className="font-['Outfit'] text-[0.9rem] md:text-[1rem] font-semibold text-[var(--color-primary)] text-center px-2 drop-shadow-md">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
