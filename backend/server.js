const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");

const Contact = require("./models/Contact");
const Project = require("./models/Project");
const Setting = require("./models/Setting");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Admin auth middleware
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
}

// Contact form API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message saved successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// Public projects API
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      projects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Public settings API
app.get("/api/settings", async (req, res) => {
  try {
    let setting = await Setting.findOne();

    if (!setting) {
      setting = await Setting.create({});
    }

    res.json({
      success: true,
      setting
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
});

// Get all messages
app.get("/api/admin/messages", adminAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Delete message
app.delete("/api/admin/messages/:id", adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Message deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Add project
app.post("/api/admin/projects", adminAuth, async (req, res) => {
  try {
    const { title, description, tech, link } = req.body;

    if (!title || !description || !tech) {
      return res.status(400).json({
        success: false,
        message: "Title, description and technology are required"
      });
    }

    const project = await Project.create({
      title,
      description,
      tech,
      link
    });

    res.status(201).json({
      success: true,
      message: "Project added successfully",
      project
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Delete project
app.delete("/api/admin/projects/:id", adminAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Update settings
app.put("/api/admin/settings", adminAuth, async (req, res) => {
  try {
    const { about, skills, email, location, linkedin, github } = req.body;

    let setting = await Setting.findOne();

    if (!setting) {
      setting = new Setting();
    }

    setting.about = about;
    setting.skills = skills;
    setting.email = email;
    setting.location = location;
    setting.linkedin = linkedin;
    setting.github = github;

    await setting.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      setting
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Connect database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
      console.log(`Admin page: http://localhost:${process.env.PORT}/admin`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });