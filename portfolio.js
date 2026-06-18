/* ==========================================================================
   Feature Module: Faculty Directory & Profiles
   ========================================================================== */

/**
 * Group members directory database configuration.
 * IMPORTANT: Customize these names, student IDs, 
 * roles, and contributions in this file!
 */
const groupMembers = [
    {
        name: "Ahmad Danish bin Kamal",
        id: "D032310142",
        role: "Faculty Coordinator & Lead Cloud Architect",
        description: "Coordinated the GitHub system integration and web hook configurations. Oversees server continuous deployment metrics.",
        icon: "fa-cloud-gear",
        github: "#",
        email: "danish.kamal@student.uptm.edu.my"
    },
    {
        name: "Nur Sarah binti Zamri",
        id: "D032310088",
        role: "Lead Academic Systems Designer",
        description: "Drafted user interfaces, interactive styles, responsive mobile wrappers, and dark glassmorphic layouts.",
        icon: "fa-compass-drafting",
        github: "#",
        email: "sarah.zamri@student.uptm.edu.my"
    },
    {
        name: "Muhammad Haris bin Rostam",
        id: "D032310255",
        role: "Systems Database Specialist",
        description: "Programmed JavaScript dashboard state engines, registry query search indexes, and local storage database serialization.",
        icon: "fa-database",
        github: "#",
        email: "haris.rostam@student.uptm.edu.my"
    },
    {
        name: "Siti Aminah binti Yusuf",
        id: "D032310119",
        role: "Academic Systems Auditor",
        description: "Executed security boundaries validation, cross-browser performance tests, and compiled compliance documentation reviews.",
        icon: "fa-file-shield",
        github: "#",
        email: "aminah.yusuf@student.uptm.edu.my"
    }
];

function initPortfolio() {
    renderPortfolio();
}

/**
 * Dynamically builds and injects faculty profile cards into grid
 */
function renderPortfolio() {
    const container = document.getElementById('portfolio-container');
    if (!container) return;

    container.innerHTML = groupMembers.map(member => `
        <div class="glass-card portfolio-card">
            <div class="portfolio-avatar">
                <i class="fa-solid ${member.icon}"></i>
            </div>
            <div class="portfolio-info">
                <h4>${member.name}</h4>
                <span class="portfolio-id">ID: ${member.id}</span>
                <span class="portfolio-role">${member.role}</span>
                <p class="portfolio-desc">${member.description}</p>
            </div>
            <div class="portfolio-socials">
                <a href="${member.github}" class="social-link" title="GitHub System Access" target="_blank">
                    <i class="fa-brands fa-github"></i>
                </a>
                <a href="mailto:${member.email}" class="social-link" title="Contact Coordinator">
                    <i class="fa-regular fa-envelope"></i>
                </a>
            </div>
        </div>
    `).join('');
}
