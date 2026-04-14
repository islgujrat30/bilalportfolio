
document.addEventListener("DOMContentLoaded", function() {
    const projects = [
        {
            title: "AI Chatbot",
            description: "A conversational AI built to assist users with various tasks and inquiries, providing a seamless and interactive experience.",
            imageUrl: "1.jfif",
            githubUrl: "#",
            liveDemoUrl: "#"
        },
        {
            title: "E-commerce Website",
            description: "A fully functional online store with features like product browsing, shopping cart, and a secure checkout process, built with modern web technologies.",
            imageUrl: "2.jfif",
            githubUrl: "#",
            liveDemoUrl: "#"
        },
        {
            title: "Portfolio Website",
            description: "A personal portfolio to showcase my skills and projects. Designed to be clean, modern, and fully responsive across all devices.",
            imageUrl: "3.jfif",
            githubUrl: "#",
            liveDemoUrl: "#"
        }
    ];

    const workGrid = document.querySelector('.work-grid');

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
                    <a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer">Live Demo</a>
                </div>
            </div>
        `;

        workGrid.appendChild(projectItem);
    });
});
