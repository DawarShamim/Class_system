const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const name = req.body?.name;
    const rollNumber = req.body?.rollNumber;    
    const password = req.body?.password;
    const department = req.body?.department;

    // Check if the student with the same rollNumber already exists in the database
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res
        .status(400)
        .json({ success: false, message: "Student with the same rollNumber already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new student
    const newStudent = new Student({
      name,
      rollNumber,
      department,
      password: hashedPassword,
    });

    // Save the student to the database
    await newStudent.save();

    res.status(201).json({ success: true, message: "Student created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create student", error: err.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const allStudents = await Student.find().select("-password");
    res.status(200).json({ success: true, data: allStudents });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get students", error: err.message });
  }
};

// Get a single student by rollNumber
exports.getStudentByRollNumber = async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;
    const student = await Student.findOne({ rollNumber }).select("-password");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get student", error: err.message });
  }
};

// Update a student by rollNumber
exports.updateStudentByRollNumber = async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;
    const name = req.body?.name;  
    const department = req.body?.department;

    const updatedStudent = await Student.findOneAndUpdate(
      { rollNumber },
      { name, department },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student updated successfully", data: updatedStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update student", error: err.message });
  }
};

// Update student password by rollNumber
exports.updateStudentPassword = async (req, res) => {
  try {
    const rollNumber  = req.params.rollNumber;
    const oldPassword= req.body?.oldPassword;
    const newPassword = req.body?.newPassword;

    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
      // Verify if the old password matches
      const passwordMatch = await bcrypt.compare(oldPassword, student.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
      }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);    
      // Update the password
    student.password = hashedPassword;
    await student.save();
  
      res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update Password", error: err.message });
    }
  };

// Delete a student by roll number
exports.deleteStudentByRollNumber = async (req, res) => {
  try {
    const rollNumber= req.params.rollNumber;

    const deletedStudent = await Student.findOneAndDelete({ rollNumber }).select("-password");

    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted successfully", data: deletedStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete student", error: err.message });
  }
};


