import mongoose from 'mongoose';
import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser'


//connect to express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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
}, 'userData'); // collection name

// Route to handle user signup
app.post('/signup', async (req, res) => {
    try {
      // Extract user details from request body
      const { username, email, password } = req.body;
      
      
      // Check if user already exists
      const existingEmail = await User.findOne({ email });
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      else if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
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

// Route to handle user login
// app.post('/login', (req, res) => {

//     // Extract user details from request body
//     const { username, password } = req.body;

//     // Check if user already exists
//     const existingUser =  User.findOne({ username })
//     .then(existingUser => {
//       if (existingUser) {
//           if(existingUser.password == password) {
//             res.status(201).json("Success")
//           }
//           else {
//             return res.json({ message: 'Password is incorrect' });
//             //res.json("the password is incorrect")
//           }
//       } else {
//         return res.json({ message: 'User is not found' });
//         //res.json("No record existed")
//       }
//     })
  
// });


// Route to handle user login
app.post('/login', async (req, res) => {
  try {
      // Extract user details from request body
      const { username, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ username });

      if (!existingUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (existingUser.password !== password) {
          return res.status(401).json({ message: 'Incorrect password' });
      }

      // If username and password are correct, send success response
      res.status(200).json({ message: 'Success' });
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