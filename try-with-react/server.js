import mongoose from 'mongoose';
import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser'

// const cors = require('cors')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const bodyParser = require('body-parser');

//connect to express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

// connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/FarmToTable", {           // database name: FarmToTable
    useNewUrlParser: true, useUnifiedTopology: true
})  

//middleware
app.use(bodyParser.json())
app.use(cors())


// // define and create User model         
const User = mongoose.model('User', {
    username: {
      type: String,
      required: true
    },
    // userType: {
    //   type: String,
    //   required: true
    // },
    email: {
      type: String,
      required: true,
      unique: true 
    },
    password: {
      type: String,
      required: true
    }
}, 'userData'); // collection name: userData

// Route to handle user signup
app.post('/signup', async (req, res) => {
    try {
      // Extract user details from request body
      const { username, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user instance
      const newUser = new User({ username, email, password });
  
      // Save user to database
      await newUser.save();
  
      // Send response
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Start server
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });