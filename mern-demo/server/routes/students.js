const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// GET /api/students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    console.error("GET students error:", err);
    res.status(500).json({
      message: err.message
    });
  }
});

// POST /api/students
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    console.error("POST students error:", err);
    res.status(400).json({
      message: err.message
    });
  }
});

// PUT /api/students/:id
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên"
      });
    }

    res.json(student);
  } catch (err) {
    console.error("PUT students error:", err);
    res.status(400).json({
      message: err.message
    });
  }
});

// DELETE /api/students/:id
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên"
      });
    }

    res.json({
      message: "Đã xóa sinh viên thành công"
    });
  } catch (err) {
    console.error("DELETE students error:", err);
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;