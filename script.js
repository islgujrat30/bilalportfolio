
document.addEventListener("DOMContentLoaded", function() {
    const projects = [
        {
            title: "Project One",
            description: "A web app for visualizing personalized Spotify data. Both public and private views were built using React, with all data stored in a private Firebase database.",
            imageUrl: "https://placehold.co/600x400/0a192f/64ffda?text=Project+One",
            githubUrl: "#",
            liveDemoUrl: "#"
        },
        {
            title: "Project Two",
            description: "A web app for visualizing personalized Spotify data. Both public and private views were built using React, with all data stored in a private Firebase database.",
            imageUrl: "https://placehold.co/600x400/0a192f/64ffda?text=Project+Two",
            githubUrl: "#",
            liveDemoUrl: "#"
        },
        {
            title: "Project Three",
            description: "A web app for visualizing personalized Spotify data. Both public and private views were built using React, with all data stored in a private Firebase database.",
            imageUrl: "https://placehold.co/600x400/0a192f/64ffda?text=Project+Three",
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
