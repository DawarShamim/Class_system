const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');

// Create a new class
router.post('/new', classController.createClass);

// Get all class
router.get('/findclass/:classCode', classController.getClassByCode);

// Get a single class by employeeId
router.get('/find/:facultyId', classController.getAllClassesWithFaculty);

router.post('/add/student',classController.addStudentsToClass);

router.post('/add/faculty',classController.addFacultyToClass)

// Update a class by employeeId
// router.put('/update/profile/:employeeId', classController.updateclassByEmployeeId);

// Update class password by employeeId
// router.put('/update/password/:employeeId', classController.updateclassPassword);

// Delete a class by employeeId
router.delete('/remove/student', classController.deleteStudentFromClass);
router.delete('/remove/faculty', classController.deleteFacultyFromClass);
router.delete('/remove/class', classController.deleteClass);

module.exports = router;
