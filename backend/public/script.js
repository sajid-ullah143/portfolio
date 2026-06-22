function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}

// Contact form
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("Message sent successfully!");
        contactForm.reset();
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log("Error:", error);
      alert("Message not sent. Check backend.");
    }
  });
}

// Load settings from database
async function loadPortfolioSettings() {
  try {
    const response = await fetch("/api/settings");
    const data = await response.json();

    if (!data.success) {
      console.log("Settings not loaded");
      return;
    }

    const setting = data.setting;

    // About
    const aboutText = document.getElementById("aboutText");
    if (aboutText) {
      aboutText.textContent = setting.about;
    }

    // Skills
    const skillsContainer = document.getElementById("skillsContainer");
    if (skillsContainer) {
      skillsContainer.innerHTML = setting.skills
        .map(skill => `<div class="skill">${skill}</div>`)
        .join("");
    }

    // Contact details
    const emailText = document.getElementById("emailText");
    const locationText = document.getElementById("locationText");
    const linkedinBtn = document.getElementById("linkedinBtn");
    const githubBtn = document.getElementById("githubBtn");

    if (emailText) emailText.textContent = setting.email;
    if (locationText) locationText.textContent = setting.location;
    if (linkedinBtn) linkedinBtn.href = setting.linkedin;
    if (githubBtn) githubBtn.href = setting.github;

  } catch (error) {
    console.log("Settings load error:", error);
  }
}

// Load projects from database
async function loadPortfolioProjects() {
  const projectsContainer = document.getElementById("projectsContainer");

  if (!projectsContainer) return;

  try {
    const response = await fetch("/api/projects");
    const data = await response.json();

    if (!data.success || data.projects.length === 0) {
      projectsContainer.innerHTML = "<p>No projects added yet.</p>";
      return;
    }

    projectsContainer.innerHTML = data.projects.map(project => {
      return `
        <div class="project-card">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <span>${project.tech}</span>
          <a href="${project.link || "#"}" target="_blank" class="project-link">
            View Project
          </a>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.log("Projects load error:", error);
  }
}

// Run functions
loadPortfolioSettings();
loadPortfolioProjects();