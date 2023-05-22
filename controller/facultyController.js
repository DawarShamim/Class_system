const Faculty = require("../models/Faculty");
const bcrypt = require('bcryptjs');

exports.createFaculty = async (req, res) => {
  try {
    const name = req.body?.name;
    const employeeId = req.body?.employeeId;
    const department = req.body?.department;
    const password = req.body?.password;

    // Check if the faculty with the same employeeId already exists in the database
    const existingFaculty = await Faculty.findOne({ employeeId });
    if (existingFaculty) {
      return res.status(400).json({ success: false, message: "Faculty with the same employeeId already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);    
    // Create a new faculty
    const newFaculty = new Faculty({
      name,
      employeeId,
      department,
      password: hashedPassword,
    });

    // Save the faculty to the database
    await newFaculty.save();

    res.status(201).json({ success: true, message: "Faculty created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create faculty", error: err.message });
  }
};

exports.getAllFaculty = async (req, res) => {
    try {
      const all_faculty = await Faculty.find().select("-password");;
      res.status(200).json({ success: true, data: all_faculty });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to get Faculty", error: err.message });
    }
  };
  
  // Get a single Faculty by employeeId
exports.getFacultyByEmployeeId = async (req, res) => {
    try {
      const employeeId = req.params.employeeId;
      const faculty = await Faculty.findOne({ employeeId }).select("-password");;
      if (!faculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }
      res.status(200).json({ success: true, data: faculty });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to get Faculty", error: err.message });
    }
  };
  
  // Update a faculty by roll number
exports.updateFacultyByEmployeeId = async (req, res) => {
    try {
      const  employeeId  = req.params.employeeId;
      const name  = req.body?.name;
      const department  = req.body?.department;
  
      const updatedFaculty = await Faculty.findOneAndUpdate(
        { employeeId },
        { name,department},
        { new: true }
      );
  
      if (!updatedFaculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }
  
      res.status(200).json({ success: true, message: "Faculty updated successfully", data: updatedFaculty });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update Faculty", error: err.message });
    }
  };
  
  exports.updateFacultyPassword = async (req, res) => {
    try {
      const employeeId = req.params.employeeId;
      const oldPassword = req.body?.oldPassword;
      const newPassword = req.body?.newPassword;
      const Passfaculty = await Faculty.findOne({ employeeId });
  
      if (!Passfaculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }
  
      // Verify if the old password matches
      const passwordMatch = await bcrypt.compare(oldPassword, Passfaculty.password);
      if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);    
      // Update the password
      Passfaculty.password = hashedPassword;
      await Passfaculty.save();
  
      res.status(200).json({ success: true, message: "Faculty password updated successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update faculty password", error: err.message });
    }
  };
  
  // Delete a Faculty by roll number
  exports.deleteFacultyByEmployeeId = async (req, res) => {
    try {
      const employeeId = req.params.employeeId;
  
      const deletedFaculty = await Faculty.findOneAndDelete({ employeeId }).select("-password");
  
      if (!deletedFaculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }
  
      res.status(200).json({ success: true, message: "Faculty deleted successfully", data: deletedFaculty });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to delete Faculty", error: err.message });
    }
  };