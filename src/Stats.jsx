import React, { useState, useEffect, useRef } from 'react';

const CountUp = ({ end, duration, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.disconnect();
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutQuart animation for smooth slow-down at the end
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return (
    <span ref={elementRef} className="font-['Outfit'] text-[2.5rem] md:text-[3.5rem] font-bold text-[var(--color-primary)] leading-none drop-shadow-[0_0_15px_rgba(102,255,213,0.3)]">
      {count}{suffix}
    </span>
  );
};

const Stats = ({ addToRefs }) => {
  const stats = [
    { label: "Projects", value: 15, suffix: "+" },
    { label: "Hours Coding", value: 100, suffix: "+" },
    { label: "Technologies", value: 10, suffix: "+" },
    { label: "Responsive Designs", value: 100, suffix: "%" }
  ];

  return (
    <section className="py-[2rem] lg:py-[4rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto z-10 relative">
      <div 
        ref={addToRefs} 
        className="opacity-0 translate-y-10 transition-all duration-700 glass-card p-[2rem] md:p-[3rem] rounded-2xl border border-[rgba(102,255,213,0.15)] bg-[rgba(6,11,25,0.7)] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-[rgba(255,255,255,0.1)]">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center space-y-3 px-4 hover:-translate-y-1 transition-transform duration-300">
              <CountUp end={stat.value} duration={2500} suffix={stat.suffix} />
              <p className="text-[var(--color-highlight)] font-['Fira_Code'] tracking-widest text-[0.8rem] md:text-[0.9rem] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
