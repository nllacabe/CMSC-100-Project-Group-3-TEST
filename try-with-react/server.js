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
      type: String,   //reference to another schema
  }
}, 'userData'); // collection name

//define and create user shopping cart model
const ShoppingCart = mongoose.model('ShoppingCart', {
  _id: {
    type: String
  },
  items: {
    type: [String]
  },
  quantity: {
    type: [Number]
  }
}, 'shoppingCartUser'); // collection name

// define and create Product model       
const Product = mongoose.model('Product', {
  productID: { // added productID (wala sa previous version)
      type: String,
    },
  productName: {
    type: String,
  },
  productType: {
    type: Number,
    enum: [1, 2, 3, 4, 5], //(Int: 1 Staple/2 Fruits and Vegetables/ 3 Livestock/ 4 Seafood/ 5 Others)
  },
  productPrice: { // additional field for price (wala sa docs)
    type: Number,
  },
  productDescription: {
    type: String,
  },
  productQuantity: {
    type: Number,
  }
}, 'productData'); // collection name: productData


//post request for signup
app.post('/signup', async (req, res) => {
  try {
    // Extract user details from request body
    const { firstName, lastName, userType, username, email, password, shoppingCart } = req.body;

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
    const newUser = new User({ firstName, lastName, username, email, password: hashedPassword, userType, shoppingCart }); // Change password to hashedPassword

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

//post request for shopping cart
app.post('/shoppingCart', async (req, res) => {
  try {
      const { _id, items, quantity } = req.body;

      // Create new shopping cart instance
      const newShoppingCart = new ShoppingCart({_id, items, quantity });

      // Save shopping cart to database
      await newShoppingCart.save();

      // Send response
      res.status(201).json({ message: 'Shopping cart created successfully', shoppingCart: newShoppingCart }); // Return the saved shopping cart object
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to handle user login
app.post('/login', async (req, res) => {
  try {
      // Extract user details from request body
      const {username, password } = req.body;

      // Check if any field is empty
      if (!username || !password) {
        return res.status(400).json({ message: 'username and password are required' });
      }      
      
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
          return res.status(401).json({ message: 'User not found' });
      }

    // Check if the userType is 'customer'
    if (existingUser.userType !== 'customer') {
      return res.status(401).json({ message: 'Access denied: Only customers are allowed to log in' });
    }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password)
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign({ userId: existingUser._id }, SECRET_KEY, { expiresIn: '1hr' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }

});

// Route to handle admin login
app.post('/login-admin', async (req, res) => {
  try {
      // Extract user details from request body
      const {username, password } = req.body;

      // Check if any field is empty
      if (!username || !password) {
        return res.status(400).json({ message: 'username and password are required' });
      }      
      
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
          return res.status(401).json({ message: 'User not found' });
      }

    // Check if the userType is 'customer'
    if (existingUser.userType !== 'admin') {
      return res.status(401).json({ message: 'Access denied: Only admin are allowed to log in' });
    }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password)
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign({ userId: existingUser._id }, SECRET_KEY, { expiresIn: '1hr' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }

});


//-----edit a user


// Route to get all products
app.get('/get-all-products', async (req, res) => {
  try {
      const products = await products.find();
      res.json(products);
  } catch (error) {
      res.status(500).json({ error: 'Unable to fetch products' });
  }
});

//post request for adding a product
app.post('/add-product', async (req, res) => {
  try {
    // Extract product details from request body
    const { productName, productType, productPrice, productDescription, productQuantity } = req.body;

    // Check if any field is empty
    if (!productName || !productType || !productPrice || !productDescription || !productQuantity) {
      return res.status(400).json({ message: 'All fields are required' });
    }      
      
    // Create new product instance
    const newProduct = new Product({ productName, productType, productPrice, productDescription, productQuantity });

    // Save product to database
    const savedProduct = await newProduct.save();

    // Send response
    res.status(201).json({ message: 'Product added successfully', product: savedProduct }); // Return the saved product object
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete-product/:productName', async (req, res) => {
  try {
      const { productName } = req.params;
      await Product.findOneAndDelete({ productName });
      res.json({ message: 'Product deleted' });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});
  
  // Start server
  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });