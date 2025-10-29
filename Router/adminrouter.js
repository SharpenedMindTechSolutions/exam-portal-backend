const express = require("express");
const router = express.Router();
const {
  AdminResult,
  registerAdmin,
  loginAdmin,
} = require("../controller/admincontroller");

router.get("/results", AdminResult);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router;
