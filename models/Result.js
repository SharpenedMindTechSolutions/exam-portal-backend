const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  answers: { type: Map, of: Number, required: true },
  malpracticeCount: { type: Number, default: 0 },
  score: Number,
  submittedAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Result', resultSchema);
