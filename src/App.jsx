import React, { useState, useEffect, useRef } from 'react';
import TechStack from './TechStack';
import Chatbot from './Chatbot';
import AIDigestSubscribe from './AIDigestSubscribe';

const useIntersectionObserver = (options) => {
  const [elements, setElements] = useState([]);
  const [entries, setEntries] = useState([]);

  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((observedEntries) => {
      setEntries(observedEntries);
    }, options);

    const { current: currentObserver } = observer;
    elements.forEach((element) => currentObserver.observe(element));

    return () => currentObserver.disconnect();
  }, [elements, options]);

  return [setElements, entries];
};

const SectionHeading = ({ children }) => (
  <div className="flex items-center mb-12 transition-all duration-700 ease-out">
    <h2 className="font-['Outfit'] text-[2.2rem] font-bold text-[var(--color-primary)]">
      {children}
    </h2>
    <div className="h-[1px] flex-grow max-w-[250px] ml-5 bg-[rgba(255,255,255,0.1)]"></div>
  </div>
);

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE after deploying
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxG8c0dcRGpgTS5GFQn7H1v6Lqvb6eiP86HF3FrQw0bC7CQYjXyYlsbgN5DMC1CK9eqTQ/exec";

function App() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [typingText, setTypingText] = useState("");
  const headingRefs = useRef([]);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | loading | success | error

  const toggleNav = () => setIsNavActive(!isNavActive);

  useEffect(() => {
    const phrases = ["automation systems", "SaaS products", "business tools"];
    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let typingTimer;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        setTypingText(currentPhrase.substring(0, letterIndex - 1));
        letterIndex--;
      } else {
        setTypingText(currentPhrase.substring(0, letterIndex + 1));
        letterIndex++;
      }

      let typeSpeed = 150;
      if (isDeleting) typeSpeed /= 2;

      if (!isDeleting && letterIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      typingTimer = setTimeout(type, typeSpeed);
    };

    type();
    return () => clearTimeout(typingTimer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    headingRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !headingRefs.current.includes(el)) {
      headingRefs.current.push(el);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setFormStatus("error");
    }
  };

  const projects = [
    {
      title: "AI Chatbot",
      description: "A conversational AI built to assist users with various tasks and inquiries, providing a seamless and interactive experience.",
      imageUrl: "1.jfif",
      githubUrl: "https://github.com/islgujrat30/bilalportfolio",
    },
    {
      title: "E-commerce Website",
      description: "A fully functional online store with features like product browsing, shopping cart, and a secure checkout process, built with modern web technologies.",
      imageUrl: "2.jfif",
      githubUrl: "https://github.com/islgujrat30/bilalportfolio",
    },
    {
      title: "Portfolio Website",
      description: "A personal portfolio to showcase my skills and projects. Designed to be clean, modern, and fully responsive across all devices.",
      imageUrl: "3.jfif",
      githubUrl: "https://github.com/islgujrat30/bilalportfolio",
    }
  ];

  return (
    <div className="relative">
      {/* Header */}
      <header className="glass-nav fixed w-full top-0 z-[1000] px-6 lg:px-12 py-5 flex justify-between items-center transition-all duration-300">
        <a href="#" className="font-['Outfit'] text-2xl font-extrabold text-[var(--color-highlight)] tracking-wide hover:scale-105 transition-transform">MB</a>
        
        <button onClick={toggleNav} className="lg:hidden flex flex-col gap-[6px] z-[1100] bg-transparent border-none p-0 cursor-pointer" aria-label="Toggle menu">
          <div className={`w-[25px] h-[2px] bg-[var(--color-highlight)] transition-all duration-300 ${isNavActive ? 'translate-y-[8px] rotate-45' : ''}`}></div>
          <div className={`w-[25px] h-[2px] bg-[var(--color-highlight)] transition-all duration-300 ${isNavActive ? 'opacity-0' : ''}`}></div>
          <div className={`w-[25px] h-[2px] bg-[var(--color-highlight)] transition-all duration-300 ${isNavActive ? '-translate-y-[8px] -rotate-45' : ''}`}></div>
        </button>

        <nav className={`fixed lg:static top-0 ${isNavActive ? 'right-0' : '-right-full'} lg:right-auto w-[75%] lg:w-auto h-screen lg:h-auto bg-[rgba(6,11,25,0.95)] lg:bg-transparent backdrop-blur-[20px] lg:backdrop-blur-none border-l lg:border-none border-[rgba(255,255,255,0.1)] transition-all duration-400 ease-in-out`}>
          <ul className="flex flex-col lg:flex-row justify-center items-center h-full gap-10 lg:gap-8">
            {['Main', 'About', 'Experience', 'Skills', 'Work', 'Contact'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} onClick={() => setIsNavActive(false)} className="font-['Outfit'] font-medium text-[var(--color-primary)] lg:text-[0.95rem] text-xl tracking-wide relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:-bottom-[6px] after:left-0 after:bg-[var(--color-highlight)] after:transition-all hover:after:w-full hover:text-[var(--color-highlight)] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main Hero */}
      <main id="main" className="relative pt-[10rem] pb-[4rem] px-[2rem] lg:px-[8rem] w-full min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-[-1] bg-[#060b19]">
          <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full opacity-30 lg:opacity-100">
            <img src="hero-bg.jpg" alt="Muhammad Bilal Background" className="w-full h-full object-cover object-center lg:object-[85%_center]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060b19] via-[#060b19]/80 to-transparent lg:via-[#060b19]/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#060b19] via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="max-w-[1100px] w-full z-10 mx-auto">
          <div className="max-w-[700px] text-center lg:text-left mx-auto lg:mx-0">
            <h1 ref={addToRefs} className="font-['Outfit'] text-[clamp(32px,7vw,75px)] font-extrabold text-[var(--color-primary)] leading-[1.1] mb-2 opacity-0 translate-y-10 transition-all duration-700">Muhammad Bilal.</h1>
            <h2 ref={addToRefs} className="font-['Outfit'] text-[clamp(20px,4.5vw,45px)] text-[var(--color-muted)] font-semibold mb-5 opacity-0 translate-y-10 transition-all duration-700 delay-100">
              I turn real-world problems into <br className="hidden lg:block" />
              <span className="text-[var(--color-highlight)] border-r-2 border-[var(--color-highlight)] pr-1 animate-blink">{typingText}</span>
            </h2>
            <p className="text-[1.1rem] lg:text-[1.15rem] text-[var(--color-muted)] leading-[1.7] mb-10 mx-auto lg:mx-0">
              I’m an IT professional focused on building SaaS products for students and businesses. I create practical, user-friendly digital solutions that solve real-world problems and can scale into reliable systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start">
              <a href="#work" className="py-3 px-8 rounded-xl font-['Outfit'] font-semibold text-[1.05rem] text-[#0a0a0a] inline-flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(100,255,218,0.25)] w-full sm:w-auto" style={{ background: "linear-gradient(90deg, #c8f04a 0%, #64ffda 100%)" }}>
                <span>Check out my work!</span><i className="fas fa-arrow-right"></i>
              </a>
              <a href="https://calendly.com/bilalfaz666/30min" target="_blank" rel="noopener noreferrer" className="py-3 px-8 rounded-xl font-['Outfit'] font-semibold text-[1.05rem] text-[#0a0a0a] inline-flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(100,255,218,0.25)] w-full sm:w-auto" style={{ background: "linear-gradient(90deg, #c8f04a 0%, #64ffda 100%)" }}>
                <span>📅 Book a Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="py-[6rem] lg:py-[8rem] px-[1rem] lg:px-[4rem] max-w-[900px] mx-auto">
        <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700">
          <SectionHeading>About Me</SectionHeading>
          <div className="text-[1.1rem] leading-[1.8] text-[var(--color-muted)] space-y-6">
            <p>Hello! My name is Muhammad Bilal, and I enjoy building digital products that live on the internet. My journey into web development started in 2021 when I began experimenting with custom themes, which sparked my interest in HTML and CSS.</p>
            <p>Since then, I’ve grown into an IT professional with experience working as an IT Officer and Project Manager at Markhor Educational Services Pvt Ltd. During this time, I’ve been involved in managing systems, leading projects, and building practical digital solutions for real-world use.</p>
            <p>My current focus is on developing SaaS products for students and businesses, creating user-friendly, scalable applications that solve real problems and deliver meaningful value.</p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-[6rem] lg:py-[8rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto">
        <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700">
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-8">
            <div className="glass-card p-[1.25rem] lg:p-[2.5rem] rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-hover-border)]">
              <h3 className="font-['Outfit'] text-[var(--color-primary)] text-[1.6rem] mb-2">Project Manager</h3>
              <p className="text-[var(--color-highlight)] font-['Fira_Code'] text-[0.9rem] mb-6">University of Gujrat | Sep 2024 - May 2025</p>
              <ul className="space-y-3">
                {["Managed and oversaw all IT infrastructure and systems, ensuring optimal performance and security.", "Led the planning, execution, and delivery of various projects, ensuring they were completed on time and within budget.", "Developed and implemented practical digital solutions to address real-world problems faced by the organization and its clients.", "Collaborated with cross-functional teams to define project scope, goals, and deliverables."].map((item, i) => (
                  <li key={i} className="relative pl-[25px] text-[1.05rem] text-[var(--color-muted)] before:content-['▹'] before:absolute before:left-0 before:text-[var(--color-highlight)] before:text-[1.1rem] leading-[1.6]">{item}</li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-[1.25rem] lg:p-[2.5rem] rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-hover-border)]">
              <h3 className="font-['Outfit'] text-[var(--color-primary)] text-[1.6rem] mb-2">Admin & IT Operations Manager</h3>
              <p className="text-[var(--color-highlight)] font-['Fira_Code'] text-[0.9rem] mb-6">International School Lahore (ISL) | July 2025 – May 2026</p>
              <ul className="space-y-3">
                {["Provide daily technical support to 30+ faculty members and staff, resolving hardware, software, and network issues.", "Managed day-to-day administrative operations and IT infrastructure to ensure a seamless academic environment.", "Support and troubleshoot classroom technology, including smartboards, projectors, and audio-visual equipment.", "Directed cross-functional staff, overseeing daily task delegation, workflow efficiency, and quality assurance."].map((item, i) => (
                  <li key={i} className="relative pl-[25px] text-[1.05rem] text-[var(--color-muted)] before:content-['▹'] before:absolute before:left-0 before:text-[var(--color-highlight)] before:text-[1.1rem] leading-[1.6]">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-[6rem] lg:py-[8rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto">
        <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700">
          <SectionHeading>My Skills</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-[3rem_2rem] text-center rounded-lg transition-transform duration-300 hover:-translate-y-1">
              <i className="fas fa-code text-[3.2rem] text-[var(--color-highlight)] mb-6 drop-shadow-[0_0_20px_var(--color-glow)]"></i>
              <h3 className="font-['Outfit'] text-[var(--color-primary)] text-[1.4rem] mb-4">Web Development</h3>
              <p className="text-[var(--color-muted)] text-[1rem] leading-[1.6]">I build and maintain websites and web applications, ensuring they are functional, user-friendly, and efficient.</p>
            </div>
            <div className="glass-card p-[3rem_2rem] text-center rounded-lg transition-transform duration-300 hover:-translate-y-1">
              <i className="fas fa-lightbulb text-[3.2rem] text-[var(--color-highlight)] mb-6 drop-shadow-[0_0_20px_var(--color-glow)]"></i>
              <h3 className="font-['Outfit'] text-[var(--color-primary)] text-[1.4rem] mb-4">Problem Solving</h3>
              <p className="text-[var(--color-muted)] text-[1rem] leading-[1.6]">I identify and analyze complex problems, and devise and implement effective solutions.</p>
            </div>
            <div className="glass-card p-[3rem_2rem] text-center rounded-lg transition-transform duration-300 hover:-translate-y-1">
              <i className="fas fa-robot text-[3.2rem] text-[var(--color-highlight)] mb-6 drop-shadow-[0_0_20px_var(--color-glow)]"></i>
              <h3 className="font-['Outfit'] text-[var(--color-primary)] text-[1.4rem] mb-4">AI Integrator</h3>
              <p className="text-[var(--color-muted)] text-[1rem] leading-[1.6]">I integrate AI technologies into existing systems and applications to enhance functionality and user experience.</p>
            </div>
          </div>
        </div>
      </section>

      <TechStack addToRefs={addToRefs} />

      {/* Education & Certifications Section */}
      <section id="education" className="py-[6rem] lg:py-[8rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto">
        <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700">
          <div className="mb-12">
            <p className="text-[var(--color-highlight)] font-['Fira_Code'] text-[0.85rem] tracking-widest uppercase mb-3">Academic Background</p>
            <h2 className="font-['Outfit'] text-[2.5rem] md:text-[3rem] font-bold text-[var(--color-primary)] leading-[1.2]">Education & Certifications</h2>
          </div>

          <div className="space-y-6">
            {/* Education Card */}
            <div className="glass-card p-[2rem] md:p-[2.5rem] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.6)]">
              <i className="fas fa-graduation-cap text-[1.8rem] text-[var(--color-highlight)] mb-6 drop-shadow-[0_0_10px_var(--color-glow)]"></i>
              <h3 className="font-['Outfit'] text-[1.6rem] font-semibold text-[var(--color-primary)] mb-1">BS Information Technology</h3>
              <p className="text-[var(--color-muted)] text-[1rem] mb-2">University of Gujrat</p>
              <p className="text-[var(--color-highlight)] font-['Fira_Code'] text-[0.85rem] uppercase tracking-wider mb-6">Sep 2021 — June 2025</p>
              <p className="text-[var(--color-muted)] text-[1rem] leading-[1.6] mb-6">Graduated with a CGPA of 3.12. Strong focus on the principal of Professional Practices, ML, Development and AI.</p>
              <div className="flex flex-wrap gap-3">
                {["Professional Practices", "Machine Learning", "Development", "Artificial Intelligence"].map((item, i) => (
                  <span key={i} className="font-['Outfit'] text-[0.85rem] text-[var(--color-primary)] px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">{item}</span>
                ))}
              </div>
            </div>

            {/* Courses Card */}
            <div className="glass-card p-[2rem] md:p-[2.5rem] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.6)]">
              <i className="fas fa-book-open text-[1.8rem] text-[var(--color-highlight)] mb-6 drop-shadow-[0_0_10px_var(--color-glow)]"></i>
              <h3 className="font-['Outfit'] text-[1.4rem] font-semibold text-[var(--color-primary)] mb-6">Courses</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
                  <h4 className="font-['Outfit'] text-[1.1rem] font-medium text-[var(--color-primary)] mb-1">Web Development</h4>
                  <p className="text-[var(--color-muted)] text-[0.95rem]">ITS Training Centre</p>
                </div>
                
                <div className="flex flex-col p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
                  <h4 className="font-['Outfit'] text-[1.1rem] font-medium text-[var(--color-primary)] mb-1">Urdu AI Automation</h4>
                  <p className="text-[var(--color-muted)] text-[0.95rem]">URDU AI</p>
                </div>
                
                <div className="flex flex-col p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
                  <h4 className="font-['Outfit'] text-[1.1rem] font-medium text-[var(--color-primary)] mb-1">Google AI Professional</h4>
                  <p className="text-[var(--color-muted)] text-[0.95rem]">Google on Coursera</p>
                </div>
                
                <div className="flex flex-col p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
                  <h4 className="font-['Outfit'] text-[1.1rem] font-medium text-[var(--color-primary)] mb-1">Python</h4>
                  <p className="text-[var(--color-muted)] text-[0.95rem]">Sheryians Coding School</p>
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="glass-card p-[2rem] md:p-[2.5rem] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.6)]">
              <i className="fas fa-award text-[1.8rem] text-[var(--color-highlight)] mb-6 drop-shadow-[0_0_10px_var(--color-glow)]"></i>
              <h3 className="font-['Outfit'] text-[1.4rem] font-semibold text-[var(--color-primary)] mb-6">Certifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(255,255,255,0.04)] relative">
                  <div className="absolute top-4 right-4 text-[var(--color-highlight)] font-['Outfit'] font-medium text-[0.85rem]">
                    June 2026
                  </div>
                  <h4 className="font-['Outfit'] text-[1.1rem] font-medium text-[var(--color-primary)] mb-1 pr-16">Google AI Professional Certificate</h4>
                  <p className="text-[var(--color-muted)] text-[0.95rem]">Coursera</p>
                </div>
                
                <div className="flex flex-col p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] transition-colors hover:bg-[rgba(255,255,255,0.04)] relative">
                  <div className="absolute top-4 right-4 text-[var(--color-highlight)] font-['Outfit'] font-medium text-[0.85rem]">
                    May 2024
                  </div>
                  <h4 className="font-['Outfit'] text-[1.1rem] font-medium text-[var(--color-primary)] mb-1 pr-16">Website Development Certification</h4>
                  <p className="text-[var(--color-muted)] text-[0.95rem]">ITS Training Centre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIDigestSubscribe addToRefs={addToRefs} />

      {/* Projects Section */}
      <section id="work" className="py-[6rem] lg:py-[8rem] px-[1rem] lg:px-[4rem] max-w-[1100px] mx-auto">
        <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700">
          <SectionHeading>Some Things I've Built</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div key={idx} className="glass-card rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1">
                <img src={project.imageUrl} alt={project.title} className="w-full aspect-video object-cover border-b border-[rgba(255,255,255,0.1)]" />
                <div className="p-[2rem_1.75rem] flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-['Outfit'] text-[var(--color-primary)] text-[1.4rem] mb-3">{project.title}</h3>
                    <p className="text-[var(--color-muted)] text-[1rem] leading-[1.6] mb-6">{project.description}</p>
                  </div>
                  <div>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-highlight)] font-['Outfit'] font-semibold text-[0.95rem] hover:opacity-80 transition-opacity">GitHub</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-[6rem] lg:py-[8rem] px-[1rem] lg:px-[4rem] max-w-[800px] mx-auto">
        <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-700 text-center">
          <p className="text-[var(--color-highlight)] font-['Fira_Code'] text-[0.85rem] tracking-widest uppercase mb-3">Contact</p>
          <h2 className="font-['Outfit'] text-[3rem] md:text-[4rem] font-extrabold text-[var(--color-primary)] mb-4">Let's build something</h2>
          <div className="flex items-center justify-center gap-3 text-[var(--color-muted)] mb-10">
            <i className="fas fa-phone text-[var(--color-highlight)]"></i>
            <span className="font-['Outfit'] text-[1.05rem]">+92325-8125893</span>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-[2rem] md:p-[2.5rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.6)] text-left">
            {formStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[rgba(100,255,218,0.1)] flex items-center justify-center mx-auto mb-5">
                  <i className="fas fa-check text-[var(--color-highlight)] text-[2rem]"></i>
                </div>
                <h3 className="font-['Outfit'] text-[1.6rem] font-bold text-[var(--color-primary)] mb-3">Message Sent!</h3>
                <p className="text-[var(--color-muted)] text-[1.05rem] leading-[1.7]">Thank you for reaching out! Check your inbox — a confirmation email is on its way. I'll get back to you within <span className="text-[var(--color-highlight)] font-medium">1–2 hours</span>.</p>
                <button onClick={() => setFormStatus('idle')} className="mt-8 text-[var(--color-highlight)] font-['Outfit'] font-semibold border border-[var(--color-highlight)] py-2 px-6 rounded-md hover:bg-[rgba(100,255,218,0.08)] transition-all">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block font-['Outfit'] text-[var(--color-primary)] text-[0.95rem] mb-2" htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Muhammad Bilal"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl px-5 py-4 text-[var(--color-primary)] font-['Outfit'] text-[1rem] placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[var(--color-highlight)] focus:bg-[rgba(100,255,218,0.03)] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-['Outfit'] text-[var(--color-primary)] text-[0.95rem] mb-2" htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl px-5 py-4 text-[var(--color-primary)] font-['Outfit'] text-[1rem] placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[var(--color-highlight)] focus:bg-[rgba(100,255,218,0.03)] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-['Outfit'] text-[var(--color-primary)] text-[0.95rem] mb-2" htmlFor="contact-message">Tell me about your project</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="I have a project idea..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl px-5 py-4 text-[var(--color-primary)] font-['Outfit'] text-[1rem] placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[var(--color-highlight)] focus:bg-[rgba(100,255,218,0.03)] transition-all resize-none"
                  />
                </div>
                {formStatus === 'error' && (
                  <p className="text-red-400 font-['Outfit'] text-[0.9rem]">Something went wrong. Please try again or email directly.</p>
                )}
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full py-4 px-8 rounded-xl font-['Outfit'] font-semibold text-[1.05rem] text-[#0a0a0a] flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(100,255,218,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(90deg, #c8f04a 0%, #64ffda 100%)" }}
                >
                  {formStatus === 'loading' ? (
                    <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                  ) : (
                    <><span>Send message</span><i className="fas fa-paper-plane"></i></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-8 border-t border-[rgba(255,255,255,0.1)] text-[0.95rem] text-[var(--color-muted)]">
        <div className="mb-4 space-x-8">
          <a href="https://www.facebook.com/share/1bVtnrFUpq/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-highlight)] hover:-translate-y-1 inline-block text-[1.6rem] transition-all"><i className="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/mbilalfazofficial?igsh=dnlxM2JyODh0ZXZq" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-highlight)] hover:-translate-y-1 inline-block text-[1.6rem] transition-all"><i className="fab fa-instagram"></i></a>
          <a href="https://www.linkedin.com/in/m-bilal-fazal?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-highlight)] hover:-translate-y-1 inline-block text-[1.6rem] transition-all"><i className="fab fa-linkedin-in"></i></a>
        </div>
        <p>Designed & Built by Muhammad Bilal</p>
      </footer>
      
      {/* AI Chatbot Assistant */}
      <Chatbot />
    </div>
  );
}

export default App;
