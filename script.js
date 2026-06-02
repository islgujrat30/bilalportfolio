document.addEventListener("DOMContentLoaded", function() {
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

    const workGrid = document.querySelector('.work-grid');

    if (workGrid) {
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('work-item');

            projectItem.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.title}">
                <div class="work-item-content">
                    <div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                    <div class="project-links">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </div>
            `;

            workGrid.appendChild(projectItem);
        });
    }

    const galleryItems = [
        {
            title: "Leadership & Management Certification",
            description: "Demonstrated skills in professional project execution, resource management, and team leadership.",
            imageUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: "Advanced Information Technology Operations",
            description: "Specialized training in IT systems architecture, network troubleshooting, and security controls.",
            imageUrl: "https://images.unsplash.com/photo-1541829019-259276a7f4fd?q=80&w=800&auto=format&fit=crop"
        }
    ];

    const galleryGrid = document.getElementById('gallery-grid');
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById("img01");
    const span = document.getElementsByClassName("close")[0];

    if (galleryGrid) {
        galleryItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <div class="gallery-item-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            galleryItem.addEventListener('click', function() {
                modal.style.display = "block";
                modalImg.src = this.querySelector('img').src;
            });
            galleryGrid.appendChild(galleryItem);
        });
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            navUl.classList.toggle('active');
        });
    }

    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const phrases = ["automation systems", "SaaS products", "business tools"];
        let phraseIndex = 0;
        let letterIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                typingText.textContent = currentPhrase.substring(0, letterIndex + 1);
                letterIndex++;
            }

            let typeSpeed = 150;
            if (isDeleting) {
                typeSpeed /= 2;
            }

            if (!isDeleting && letterIndex === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && letterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    const animatedElements = document.querySelectorAll('.hero h1, .hero h2, .section-heading');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
});
