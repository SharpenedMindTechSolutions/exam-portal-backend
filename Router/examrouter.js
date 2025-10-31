// const express = require('express');
// const router = express.Router();
// const {
//     getAllExams,
//     createExam,
//     getExamById,
//     submitExam,

// } = require('../controller/examcontroller');
// router.post('/createexam', createExam)
// router.get('/getexam', getAllExams);
// router.get('/:id', getExamById);
// router.post('/:id/submit', submitExam);

// module.exports = router;

const express = require("express");
const {
  createExam,
  getAllExams,
  getExamById,
  deleteExam,
  updateExam,submitExam,checkExamStatus,getParticularExams
} = require("../controller/examcontroller");

const router = express.Router();

router.post("/create-exam", createExam); // POST /api/exams/create-exam
router.get("/get-exam/", getAllExams); // GET  /api/exams/get-exam
router.get("/get-exam/:domain", getParticularExams); // GET  /api/exams/get-exam/:domain
router.get("/:id", getExamById); // GET  /api/exams/:id
router.put("/:id", updateExam); // ✅ EDIT exam
router.delete("/:id", deleteExam); // DELETE /api/exams/:id
router.post("/:id/submit", submitExam); // POST 
router.get('/status/:userId/:examId', checkExamStatus); // GET

module.exports = router;

