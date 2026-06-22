const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");

const token = localStorage.getItem("adminToken");

if (token) {
  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadMessages();
  loadProjects();
  loadSettings();
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  };
}

async function loginAdmin() {
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem("adminToken", data.token);

    loginBox.classList.add("hidden");
    dashboard.classList.remove("hidden");

    loadMessages();
    loadProjects();
    loadSettings();
  } else {
    alert(data.message);
  }
}

function logoutAdmin() {
  localStorage.removeItem("adminToken");
  window.location.reload();
}

async function loadMessages() {
  const messagesList = document.getElementById("messagesList");

  const response = await fetch("/api/admin/messages", {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!data.success) {
    messagesList.innerHTML = "<p>No messages found.</p>";
    return;
  }

  if (data.messages.length === 0) {
    messagesList.innerHTML = "<p>No messages received yet.</p>";
    return;
  }

  messagesList.innerHTML = data.messages.map((msg) => {
    return `
      <div class="item-card">
        <h3>${msg.name}</h3>
        <p><strong>Email:</strong> ${msg.email}</p>
        <p><strong>Message:</strong> ${msg.message}</p>
        <p><small>${new Date(msg.createdAt).toLocaleString()}</small></p>
        <button class="delete-btn" onclick="deleteMessage('${msg._id}')">Delete</button>
      </div>
    `;
  }).join("");
}

async function deleteMessage(id) {
  const confirmDelete = confirm("Are you sure you want to delete this message?");

  if (!confirmDelete) return;

  const response = await fetch(`/api/admin/messages/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (data.success) {
    alert("Message deleted");
    loadMessages();
  }
}

const projectForm = document.getElementById("projectForm");

projectForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("projectTitle").value;
  const description = document.getElementById("projectDescription").value;
  const tech = document.getElementById("projectTech").value;
  const link = document.getElementById("projectLink").value;

  const response = await fetch("/api/admin/projects", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title,
      description,
      tech,
      link
    })
  });

  const data = await response.json();

  if (data.success) {
    alert("Project added successfully");
    projectForm.reset();
    loadProjects();
  } else {
    alert(data.message);
  }
});

async function loadProjects() {
  const projectsList = document.getElementById("projectsList");

  const response = await fetch("/api/projects");
  const data = await response.json();

  if (!data.success || data.projects.length === 0) {
    projectsList.innerHTML = "<p>No projects added yet.</p>";
    return;
  }

  projectsList.innerHTML = data.projects.map((project) => {
    return `
      <div class="item-card">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p><strong>Tech:</strong> ${project.tech}</p>
        <p><strong>Link:</strong> ${project.link || "#"}</p>
        <button class="delete-btn" onclick="deleteProject('${project._id}')">Delete</button>
      </div>
    `;
  }).join("");
}

async function deleteProject(id) {
  const confirmDelete = confirm("Are you sure you want to delete this project?");

  if (!confirmDelete) return;

  const response = await fetch(`/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (data.success) {
    alert("Project deleted");
    loadProjects();
  }
}

async function loadSettings() {
  const response = await fetch("/api/settings");
  const data = await response.json();

  if (!data.success) return;

  const setting = data.setting;

  document.getElementById("aboutInput").value = setting.about;
  document.getElementById("skillsInput").value = setting.skills.join(", ");
  document.getElementById("emailInput").value = setting.email;
  document.getElementById("locationInput").value = setting.location;
  document.getElementById("linkedinInput").value = setting.linkedin;
  document.getElementById("githubInput").value = setting.github;
}

const settingsForm = document.getElementById("settingsForm");

settingsForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const about = document.getElementById("aboutInput").value;
  const skills = document.getElementById("skillsInput").value
    .split(",")
    .map(skill => skill.trim())
    .filter(skill => skill !== "");

  const email = document.getElementById("emailInput").value;
  const location = document.getElementById("locationInput").value;
  const linkedin = document.getElementById("linkedinInput").value;
  const github = document.getElementById("githubInput").value;

  const response = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      about,
      skills,
      email,
      location,
      linkedin,
      github
    })
  });

  const data = await response.json();

  if (data.success) {
    alert("Portfolio details updated successfully");
  } else {
    alert(data.message);
  }
});