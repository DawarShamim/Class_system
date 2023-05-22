const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');

// Create a new student
router.post("/new", studentController.createStudent);

// Get all students
router.get("/all", studentController.getAllStudents);

// Get a single student by rollNumber
router.get("/find/:rollNumber", studentController.getStudentByRollNumber);

// Update a student by rollNumber
router.put("/update/profile/:rollNumber", studentController.updateStudentByRollNumber);

// Update student password by rollNumber
router.put("/update/password/:rollNumber", studentController.updateStudentPassword);

// Delete a student by rollNumber
router.delete("/delete/:rollNumber", studentController.deleteStudentByRollNumber);

module.exports = router;
