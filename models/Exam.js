const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    domain: { type: String, required: true },
    duration: { type: Number },
    passingScore: { type: Number },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
