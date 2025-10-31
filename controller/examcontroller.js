
const Exam = require("../models/Exam");
const Result = require("../models/Result");

// ✅ Create new exam
const createExam = async (req, res) => {
  try {
    const { title, description, domain, duration, passingScore, questions } = req.body;

    if (!title || !domain)
      return res.status(400).json({ message: "Title and domain are required" });
    if (!questions || questions.length === 0)
      return res.status(400).json({ message: "At least one question required" });

    const exam = new Exam({ title, description, domain, duration, passingScore, questions });
    await exam.save();
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single exam by ID
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete exam
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update exam by ID
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, domain, duration, passingScore, questions } = req.body;

    const existingExam = await Exam.findById(id);
    if (!existingExam) return res.status(404).json({ message: "Exam not found" });

    existingExam.title = title || existingExam.title;
    existingExam.description = description || existingExam.description;
    existingExam.domain = domain || existingExam.domain;
    existingExam.duration = duration || existingExam.duration;
    existingExam.passingScore = passingScore || existingExam.passingScore;

    if (questions && Array.isArray(questions)) {
      existingExam.questions = questions;
    }

    await existingExam.save();
    res.status(200).json({ message: "Exam updated successfully", exam: existingExam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


 const submitExam = async (req, res) => {
  const { id } = req.params;
  const { userId, answers, malpracticeCount } = req.body;

  try {
    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // Calculate score
    let score = 0;
    for (const question of exam.questions) {
      const userAnswer = answers[question._id];
      if (userAnswer === question.correctAnswer) score++;
    }

    const submission = new Result({
      userId,
      examId: id,
      answers,
      malpracticeCount,
      score,
    });

    await submission.save();
    res.status(201).json({ message: "Exam submitted", score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed" });
  }
};




const checkExamStatus = async (req, res) => {
  const { userId, examId } = req.params;
  const result = await Result.findOne({ userId, examId });

  if (result) {
    return res.status(403).json({ 
      message: "Exam already completed ", 
      completed: true 
    });
  }

  res.json({ allowed: true });
};



// user particulary dream get it
const getParticularExams = async (req, res) => {
  try {
    const { domain } = req.params; // e.g., "Data Science"
    let exams;

    if (domain) {
      // ✅ Use regex for partial and case-insensitive matching
      exams = await Exam.find({
        domain: { $regex: domain, $options: "i" }
      }).sort({ createdAt: -1 });
    } else {
      exams = await Exam.find().sort({ createdAt: -1 });
    }

    res.status(200).json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ message: "Error fetching exams" });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  deleteExam,
  updateExam,
  submitExam,
  checkExamStatus,
  getParticularExams
};

