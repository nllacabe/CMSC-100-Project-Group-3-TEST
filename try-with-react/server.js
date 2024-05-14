import mongoose from 'mongoose';
import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'secretkey';

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
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
    username: {
      type: String,
      required: true,
      unique: true
    },
    userType: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true 
    },
    password: {
      type: String,
      required: true
    },
    shoppingCart: {
      type: mongoose.Schema.Types.ObjectId,   //reference to another schema
      ref: 'ShoppingCart'
  }
}, 'userData'); // collection name

// Route to handle user signup
// app.post('/signup', async (req, res) => {
//     try {
//       // Extract user details from request body
//       const { firstName, lastName, userType,username, email, password } = req.body;
      
//       // Check if any field is empty
//       if (!username || !email || !password || !firstName || !lastName) {
//         return res.status(400).json({ message: 'All fields are required' });
//       }      
      
      
//       // Check if user already exists
//       const existingEmail = await User.findOne({ email });
//       const existingUser = await User.findOne({ username });
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
//       else if (existingEmail) {
//         return res.status(400).json({ message: 'Email already exists' });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);  //create hashedPass
//       // Create new user instance
//       const newUser = new User({ firstName, lastName, username, email, hashedPassword, userType });

//       // Save user to database
//       await newUser.save();
  
//       // Send response
//       res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

app.post('/signup', async (req, res) => {
  try {
    // Extract user details from request body
    const { firstName, lastName, userType, username, email, password } = req.body;

    // Check if any field is empty
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }      
      
    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    } else if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  //create hashedPassword
    // Create new user instance
    const newUser = new User({ firstName, lastName, username, email, password: hashedPassword, userType }); // Change password to hashedPassword

    // Save user to database
    await newUser.save();

    // Send response
    res.status(201).json({ message: 'User created successfully', user: newUser }); // Return the saved user object
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/signup', async (req, res) => {
  try {
    const users = await User.find()
    res.status(201).json(users)
  }

  catch (error){
    res.status(500).json({error: "Unable to get user"})
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  try {
      // Extract user details from request body
      const { username, password } = req.body;

      //if (userType != customer) {
      //  return res.status(401).json({message: 'cannot access'})
      //}

      // Check if any field is empty
      if (!username || !password) {
        return res.status(400).json({ message: 'username and password are required' });
      }      
      
      // Check if user already exists
      const existingUser = await User.findOne({ username });

      if (!existingUser) {
          return res.status(401).json({ message: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, existingUser.password)
      if (!isPasswordvalid) {
          return res.status(401).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign({userId: user._id}, SECRET_KEY, { expiresIn: '1hr' })
      res.json({message: 'Login successful'})

      // If username and password are correct, send success response
     // res.status(200).json({ message: 'Success' });
  } catch (error) {
     // console.error(error);
      res.status(500).json({ error: 'Internal server error', error });
  }
});



  
  // Start server
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });