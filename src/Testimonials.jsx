import React from 'react';
import women1 from '../public/women1.jpg';
import men1 from '../public/men1.jpg';
import women2 from '../public/women2.jpg';
import men2 from '../public/men2.jfif';

const testimonials = [
  {
    rating: 5,
    text: "Bilal transformed our outdated website into a modern, high-performing business website that perfectly represents our brand. The communication was excellent, and the final result exceeded our expectations.",
    name: "Sarah Mitchell",
    role: "Marketing Manager",
    company: "NovaTech Solutions",
    country: "🇺🇸 United States",
    type: "Web Design",
    image: women1
  },
  {
    rating: 5,
    text: "The custom AI chatbot Bilal built for our school website has been a game-changer. It handles admissions queries 24/7, saving our staff countless hours while providing instant answers to parents.",
    name: "James Robertson",
    role: "Principal",
    company: "Oakridge Academy",
    country: "🇬🇧 United Kingdom",
    type: "AI Chatbot for School Website",
    image: men1
  },
  {
    rating: 5,
    text: "Working with Bilal was a fantastic experience. He delivered a fast, responsive, and beautifully designed business website that perfectly aligns with our corporate identity and growth goals.",
    name: "Ayesha Khan",
    role: "CEO",
    company: "Vertex Enterprises",
    country: "🇦🇪 UAE",
    type: "Business Website",
    image: women2
  },
  {
    rating: 5,
    text: "The AI Agent integrated into our workflow has automated our customer support triage flawlessly. Bilal's technical expertise, attention to detail, and problem-solving skills are truly top-notch!",
    name: "David Chen",
    role: "Operations Director",
    company: "Nexa Logistics",
    country: "🇨🇦 Canada",
    type: "AI Agent",
    image: men2
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-[6rem] lg:py-[8rem] px-[1rem] overflow-hidden w-full max-w-[100vw]">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-[1100px] mx-auto px-[1rem] lg:px-[3rem] mb-12">
        <div className="flex items-center transition-all duration-700 ease-out">
          <h2 className="font-['Outfit'] text-[2.2rem] font-bold text-[var(--color-primary)]">
            Client Testimonials
          </h2>
          <div className="h-[1px] flex-grow max-w-[250px] ml-5 bg-[rgba(255,255,255,0.1)]"></div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="flex animate-marquee whitespace-nowrap min-w-max py-4">
          {/* We duplicate the array to make the infinite scroll seamless */}
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div 
              key={idx} 
              className="glass-card mx-4 p-8 rounded-xl border border-[rgba(102,255,213,0.15)] flex flex-col justify-between w-[380px] h-[340px] whitespace-normal transition-all duration-300 hover:border-[var(--color-highlight)] hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(100,255,218,0.1)]"
            >
              <div>
                {/* Top: Stars, Verified & Tag */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[0.85rem] text-[var(--color-highlight)] font-medium bg-[rgba(102,255,213,0.1)] px-2 py-0.5 rounded-full w-max">
                      <i className="fas fa-check-circle"></i> Verified
                    </div>
                  </div>
                  <div className="text-[0.75rem] font-['Fira_Code'] text-[var(--color-primary)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.1)]">
                    {testimonial.type}
                  </div>
                </div>

                {/* Body Text */}
                <p className="text-[0.95rem] text-[var(--color-muted)] leading-relaxed italic line-clamp-5">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Bottom: Profile Info */}
              <div className="mt-6 flex items-center gap-4 pt-5 border-t border-[rgba(255,255,255,0.05)]">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[rgba(102,255,213,0.3)] shrink-0 bg-[rgba(102,255,213,0.05)]">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-['Outfit'] text-[var(--color-primary)] font-semibold text-[1.05rem]">
                    {testimonial.name}
                  </span>
                  <span className="text-[0.8rem] text-[var(--color-muted)]">
                    {testimonial.role} at <span className="text-[var(--color-highlight)]">{testimonial.company}</span>
                  </span>
                  <span className="text-[0.75rem] text-gray-400 mt-0.5">
                    {testimonial.country}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
