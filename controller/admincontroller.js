const Result = require("../models/Result");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required" });
    }

    const existingAdmin = await Admin.findOne({ name });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        password: newAdmin.password,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required" });
    }

    const admin = await Admin.findOne({ name });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id, name: admin.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
      },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.AdminResult = async (req, res) => {
  try {
    const submissions = await Result.find()
      .populate("userId", "name email domain")
      .populate("examId", "title");

    const data = submissions.map((s) => ({
      _id: s._id,
      name: s.userId?.name || "Unknown",
      email: s.userId?.email || "Unknown",
      domain: s.userId?.domain || "Not Specified",
      examTitle: s.examId?.title || "Unknown",
      score: s.score,
    }));

    res.json(data);
  } catch (err) {
    console.error("❌ AdminResult Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch data", details: err.message });
  }
};
