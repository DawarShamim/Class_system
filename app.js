const express = require("express");
const mongoose =require("mongoose");
const {success,error} = require("consola");
const cors = require("cors");
const DBurl="mongodb+srv://dawarshamim1:7272ammi@d1.xnjozd2.mongodb.net/Classroom";
const app = express();
const passport = require("passport");

const{ UserRole,Authentication,login } =require('./Auth');

app.use(express.json()); // this line is for parsing json body
app.use(cors());

app.get('/login',login);
require("./middleware/passport")(passport);

app.use('/user', require('./routes/userRoutes'));
app.use('/class',require('./routes/classRoutes'))
app.use('/faculty', require('./routes/facultyRoutes'));

app.use('/student', require('./routes/studentRoutes'));

startApp = async () => {
    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(DBurl);
  
      success({
        message: "Connected to the database successfully",
        badge: true,
      });
  
      app.listen(3000, () => {
        success({
          message: "Server is started at PORT: 3000",
        });
      });
    } catch (err) {
      error({
        message: `Unable to connect with database: ${err.message}`,
        badge: true,
      });
      startApp();
    }
  };
  
  startApp();