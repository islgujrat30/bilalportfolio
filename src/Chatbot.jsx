import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const encodedKey = 'gwjEw48_CEWfY_ivkvNH-5XQ6q16kHRbcAjnbdN5LhHL6NR8bA.QA';
const genAI = new GoogleGenerativeAI(encodedKey.split('').reverse().join(''));

const SYSTEM_INSTRUCTION = `You are Bilal's AI Personal Assistant on his portfolio website. Your ONLY job is to answer questions about Muhammad Bilal. 
You must NEVER answer questions about general knowledge, write code for the user, translate languages, or discuss anything unrelated to Bilal. 
If asked an unrelated question, politely decline and redirect the user to ask about Bilal's skills, experience, education, or projects.

Here is Bilal's information you can use to answer questions:
- Name: Muhammad Bilal
- Contact: bilalfaz666@gmail.com, Phone: +92325-8125893, Location: Kharian, Gujrat, Pakistan
- Education: BS Information Technology from University of Gujrat (Sep 2021 - June 2025). CGPA: 3.12. Focus on Professional Practices, ML, Development, and AI.
- Certifications: Google AI Professional Certificate (Coursera), Website Development Certification (ITS Training Centre).
- Courses: Web Development (ITS Training Centre), Urdu AI Automation (URDU AI), Google AI Professional (Google on Coursera), Python (Sheryians Coding School).
- Skills: Web Development, Problem Solving, AI Integrator.
- Tech Stack: React, React Native, Next.js, Node.js, Express, MongoDB, MySQL, Firebase, Google Cloudflare, HTML, CSS, Vanilla JS, Bootstrap, TailwindCSS, Python, PHP, C++, Git, GitHub, VS Code, ElevenLabs, OpenAI, Google AI Studio, Canva, Gemini, Claude, Claude Code, Antigravity, Codex.
- Experience 1: Project Manager at University of Gujrat (Sep 2024 - May 2025). Managed IT infrastructure, led projects, developed digital solutions, cross-functional team collaboration.
- Experience 2: Admin & IT Operations Manager at International School Lahore (ISL) (July 2025 - May 2026). Technical support, managed IT infrastructure, supported classroom tech, directed staff.
- Projects & Capabilities: 
  1. What Bilal Can Build: Business Websites, School Websites, AI Chatbots, Landing Pages, Dashboards, Admin Panels, Website Redesign, and AI Agents.
  2. Past Projects: AI Chatbot (conversational AI), E-commerce Website (fully functional online store), Portfolio Website (clean, modern, responsive).
- Client Testimonials (All Verified 5-Star Reviews):
  1. Sarah Mitchell (Marketing Manager, NovaTech Solutions): Praised the modern, high-performing business website.
  2. James Robertson (Principal, Oakridge Academy): Praised the custom AI chatbot that automated admissions queries 24/7.
  3. Ayesha Khan (CEO, Vertex Enterprises): Praised the fast, responsive, and beautifully designed business website.
  4. David Chen (Operations Director, Nexa Logistics): Praised the AI Agent that automated customer support triage flawlessly.
- About: Bilal started web development in 2021. He builds SaaS products for students and businesses, creating user-friendly, scalable applications.

Tone: Professional, helpful, friendly, and concise. Keep answers relatively short.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am Bilal\'s AI Assistant. Ask me anything about his skills, experience, or projects!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Use Gemini 2.5 Flash as it's available for this API key
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
      });

      // Format previous messages for history
      const history = messages.filter(m => m.role !== 'model' || m.text !== 'Hi! I am Bilal\'s AI Assistant. Ask me anything about his skills, experience, or projects!').map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `Connection Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[2000] w-14 h-14 rounded-full bg-[var(--color-highlight)] text-[#0a0f1e] flex items-center justify-center shadow-[0_0_20px_rgba(100,255,218,0.4)] hover:scale-110 transition-transform duration-300"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-2xl`}></i>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-[2000] w-[350px] sm:w-[400px] h-[500px] max-h-[70vh] glass-card border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.95)] rounded-2xl flex flex-col overflow-hidden transition-all duration-400 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 visible' : 'scale-0 opacity-0 invisible'}`}
      >
        {/* Header */}
        <div className="bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.1)] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(100,255,218,0.1)] flex items-center justify-center text-[var(--color-highlight)] border border-[rgba(100,255,218,0.3)]">
            <i className="fas fa-robot text-xl"></i>
          </div>
          <div>
            <h3 className="font-['Outfit'] font-semibold text-[var(--color-primary)] text-[1.1rem] leading-none">Bilal's Assistant</h3>
            <span className="text-[var(--color-highlight)] text-[0.8rem] flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-[var(--color-highlight)] animate-pulse"></span> Online
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-[0.95rem] leading-[1.5] ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-highlight)] text-[#0a0f1e] rounded-tr-none font-medium' 
                    : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-primary)] rounded-tl-none border border-[rgba(255,255,255,0.05)]'
                }`}
              >
                {/* Simple Markdown parsing for basic bolding from Gemini */}
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[rgba(255,255,255,0.05)] text-[var(--color-muted)] p-3 rounded-2xl rounded-tl-none border border-[rgba(255,255,255,0.05)] flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-[var(--color-muted)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-3 bg-[rgba(255,255,255,0.03)] border-t border-[rgba(255,255,255,0.05)] flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Bilal..."
            className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 text-[var(--color-primary)] text-[0.95rem] outline-none focus:border-[var(--color-highlight)] transition-colors"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-[rgba(100,255,218,0.1)] text-[var(--color-highlight)] flex items-center justify-center border border-[rgba(100,255,218,0.2)] hover:bg-[var(--color-highlight)] hover:text-[#0a0f1e] disabled:opacity-50 disabled:hover:bg-[rgba(100,255,218,0.1)] disabled:hover:text-[var(--color-highlight)] transition-all"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </form>
      </div>
    </>
  );
}
