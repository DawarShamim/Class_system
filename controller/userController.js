const bcrypt = require('bcryptjs');
const User = require('../models/User');

// User registration
exports.registerUser = async (req, res) => {
  try {
    const name =req.body?.name;
    const username= req.body?.username;
    const email = req.body?.email;
    const password  = req.body?.password;
    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);    
    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const allUser = await User.find().select("-password");;
    res.status(200).json({ success: true, data: allUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get User", error: err.message });
  }
};

// Get a single User by username
exports.getUserByusername = async (req, res) => {
  try {
    const username = req.params.username;
    
    const findUser = await User.findOne({ username: username }).select("-password");
    if (!findUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: findUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to get User", error: err.message });
  }
};

// Update a User by username
exports.updateUserByusername = async (req, res) => {
  try {
    const username  = req.params.username;
    const name = req.body?.name;
    const department = req.body?.department;

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { name, department },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update User", error: err.message });
  }
};

// Update User password by username
exports.updateUserPassword = async (req, res) => {
  try {
    const username  = req.params.username;
    const oldPassword = req.body?.oldPassword;
    const newPassword = req.body?.newPassword;


    const updateUser = await User.findOne({ username });

    if (!updateUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
      // Verify if the old password matches
      const passwordMatch = await bcrypt.compare(oldPassword, updateUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
      }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);    
      // Update the password
      updateUser.password = hashedPassword;
    await updateUser.save();
  
      res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update Password", error: err.message });
    }
  };

// Delete a User by roll number
exports.deleteUserByusername = async (req, res) => {
  try {
    const username = req.params.username;

    const deletedUser = await User.findOneAndDelete({ username }).select("-password");

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully", data: deletedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete User", error: err.message });
  }
};
