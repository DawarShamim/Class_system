const express = require('express');
const router = express.Router();
const facultyController = require('../controller/facultyController');

// Create a new faculty
router.post('/new', facultyController.createFaculty);

// Get all faculty
router.get('/all', facultyController.getAllFaculty);

// Get a single faculty by employeeId
router.get('/find/:employeeId', facultyController.getFacultyByEmployeeId);

// Update a faculty by employeeId
router.put('/update/profile/:employeeId', facultyController.updateFacultyByEmployeeId);

// Update faculty password by employeeId
router.put('/update/password/:employeeId', facultyController.updateFacultyPassword);

// Delete a faculty by employeeId
router.delete('/delete/:employeeId', facultyController.deleteFacultyByEmployeeId);

module.exports = router;
