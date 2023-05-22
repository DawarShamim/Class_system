const Class = require('../models/Class');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

exports.createClass = async (req, res) => {
    try {
      const { classCode,name, facultyId, studentRollNumbers } = req.body;
  
      // Check if the faculty ID exists in the database
      const existingFaculty = await Faculty.findById(facultyId);
      if (!existingFaculty) {
        return res.status(400).json({ success: false, message: "Invalid faculty ID" });
      }
  
      // Find the student object IDs based on the provided roll numbers
      const existingStudents = await Student.find({ rollNumber: { $in: studentRollNumbers } });
      if (existingStudents.length !== studentRollNumbers.length) {
        return res.status(400).json({ success: false, message: "Invalid student roll numbers" });
      }
  
      // Create a new class
      const newClass = new Class({
        classCode,
        name,
        createdBy:facultyId,
        faculty: facultyId,
        students: existingStudents.map(student => student._id),
      });
  
      // Save the class to the database
      await newClass.save();
  
      res.status(201).json({ success: true, message: "Class created successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to create class", error: err.message });
    }
  };
  
exports.getAllClassesWithFaculty = async (req, res) => {
    try {
      const facultyId = req.params.facultyId;
      
      // Find all classes where the specified faculty is added
      const classesWithFaculty = await Class.find({ faculty: facultyId }).populate('faculty students');
      
      res.status(200).json({ success: true, data: classesWithFaculty });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to get classes with faculty", error: err.message });
    }
  };

  exports.getClassByCode = async (req, res) => {
    try {
      const classCode = req.params.classCode;
      const foundClass = await Class.findOne({ classCode: classCode }).populate('faculty students');
      
      if (!foundClass) {
        return res.status(404).json({ success: false, message: "Class not found" });
      }
      res.status(200).json({ success: true, data: foundClass });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to get class", error: err.message });
    }
  };

  exports.addStudentsToClass = async (req, res) => {
    try {
      const { classId, studentRollNumbers } = req.body;
  
      // Check if the class exists
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return res.status(404).json({ success: false, message: "Class not found" });
      }
  
      // Find the student object IDs based on the provided roll numbers
      const existingStudents = await Student.find({ rollNumber: { $in: studentRollNumbers } });
      if (existingStudents.length !== studentRollNumbers.length) {
        return res.status(400).json({ success: false, message: "Invalid student roll numbers" });
      }
  
      // Add the students to the class
      existingClass.students.push(...existingStudents.map(student => student._id));
      await existingClass.save();
  
      res.status(200).json({ success: true, message: "Students added to the class successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to add students to the class", error: err.message });
    }
  };

  exports.addFacultyToClass = async (req, res) => {
    try {
      const { classId, employeeId } = req.body;
  
      // Check if the class exists
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return res.status(404).json({ success: false, message: "Class not found" });
      }
  
      // Find the faculty based on the provided employeeId
      const existingFaculty = await Faculty.findOne({ employeeId:employeeId });
      if (!existingFaculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }

      const isFacultyAlreadyAdded = existingClass.faculty.includes(existingFaculty._id);
        if (isFacultyAlreadyAdded) {
      return res.status(400).json({ success: false, message: "Faculty already added to the class" });
        }
      // Add the faculty to the class
      existingClass.faculty.push(existingFaculty._id);
      await existingClass.save();
  
      res.status(200).json({ success: true, message: "Faculty added to the class successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to add faculty to the class", error: err.message });
    }
  };
  
  exports.deleteStudentFromClass = async (req, res) => {
    try {
      const { classId, studentId } = req.body;
  
      // Check if the class exists
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return res.status(404).json({ success: false, message: "Class not found" });
      }
  
      // Check if the student exists in the class
      const studentIndex = existingClass.students.findIndex(student => student.toString() === studentId);
      if (studentIndex === -1) {
        return res.status(404).json({ success: false, message: "Student not found in the class" });
      }
  
      // Remove the student from the class
      existingClass.students.splice(studentIndex, 1);
      await existingClass.save();
  
      res.status(200).json({ success: true, message: "Student removed from the class successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to remove student from the class", error: err.message });
    }
  };

  exports.deleteFacultyFromClass = async (req, res) => {
    try {
      const { classId, facultyId } = req.body;
  
      // Check if the class exists
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        return res.status(404).json({ success: false, message: "Class not found" });
      }
  
      // Check if there is more than one faculty assigned to the class
      if (existingClass.faculty.length <= 1) {
        return res.status(400).json({ success: false, message: "Cannot delete faculty as there is only one faculty assigned to the class" });
      }
  
      // Check if the faculty exists in the class
      const facultyIndex = existingClass.faculty.findIndex(faculty => faculty.toString() === facultyId);
      if (facultyIndex === -1) {
        return res.status(404).json({ success: false, message: "Faculty not found in the class" });
      }
  
      // Remove the faculty from the class
      existingClass.faculty.splice(facultyIndex, 1);
      await existingClass.save();
  
      res.status(200).json({ success: true, message: "Faculty removed from the class successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to remove faculty from the class", error: err.message });
    }
  };
  
  exports.deleteClass = async (req, res) => {
    try {
      const classId = req.body?.classId;
  
      // Check if the class exists
      const deletedClass = await Class.findOneAndDelete({ _id: classId });
      if (!deletedClass) {
        return res.status(404).json({ success: false, message: "Class not found" });
      }
  
      res.status(200).json({ success: true, message: "Class deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to delete class", error: err.message });
    }
  };
  

  
  