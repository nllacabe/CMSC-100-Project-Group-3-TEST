// import
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'secretkey';

// connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/FarmToTable")           // database name: FarmToTable

const subSchema = new mongoose.Schema({
    productID: { // added productID (wala sa previous version)
        type: String,
    },
    productName: {
        type: String,
    },
    productDescription: {
        type: String,
    },
    productType: {
        type: Number,
        enum: [1, 2, 3, 4, 5], //(Int: 1 Staple/2 Fruits and Vegetables/ 3 Livestock/ 4 Seafood/ 5 Others)
    },
    productQuantity: {
        type: Number,
    },
    productPrice: { // additional field for price (wala sa docs)
        type: Number,
    },
    productImg: {
        type: String
    },
    count: {
        type: Number
    }
})

// define and create User model         
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
    shoppingCart: [subSchema],
    totalQty: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    }
}, 'userData'); // collection name: userData

// define and create Product model       
const Product = mongoose.model('Product', {
    productID: { // added productID (wala sa previous version)
      type: String,
    },
    productName: {
      type: String,
    },
    productDescription: {
      type: String,
    },
    productType: {
      type: Number,
      enum: [1, 2, 3, 4, 5], //(Int: 1 Staple/2 Fruits and Vegetables/ 3 Livestock/ 4 Seafood/ 5 Others)
    },
    productQuantity: {
      type: Number,
    },
    productPrice: { // additional field for price (wala sa docs)
      type: Number,
    },
    productImg: {
      type: String
    }
}, 'productData'); // collection name: productData

// define and create Order model           
const Order = mongoose.model('Order', {
    transactionID: {
        type: String,
        unique: true // Ensure transactionID is unique
    },
    productIDs: {
        type: [String],
    },
    productNames: {
        type: [String],
    },
    orderQuantity: {
        type: [Number],
    },
    orderStatus: {
        type: Number,
    },
    email: {
        type: String,
    },
    dateOrdered: {
        type: Date,
    },
    timeOrdered: {
        type: String,
    }
}, 'orderData'); // collection name: orderData


// function for Sign-up/Log-in ----------------

const customerSignup = async (req, res) => {                  // post method for saving users
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
};

const customerLogin = async (req, res) => {                  // post method for saving users
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
  
};

const adminLogin = async (req, res) => {                  // post method for saving users
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
};

const getUsers = async (req, res) => {                  // post method for saving users
    try {
        const users = await User.find()
        res.status(201).json(users)
      }
    
      catch (error){
        res.status(500).json({error: "Unable to get user"})
      }
};

// --------------------------------------------


// function for User --------------------------

const updateCart = async (req, res) => {              // post method for updating cart
    res.json(await User.updateOne({email: req.body.email}, {$set: {shoppingCart: req.body.shoppingCart, totalQty: req.body.totalQty, totalPrice: req.body.totalPrice}}))
};

const getCart = async (req, res) => {
    res.json(await User.find({email: req.query.email}, { shoppingCart: 1 }))
};

const getTotalQty = async (req, res) => {
    res.json(await User.find({email: req.query.email}, { totalQty: 1 }))
};

const getTotalPrice = async (req, res) => {
    res.json(await User.find({email: req.query.email}, { totalPrice: 1 }))
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
  
  // Endpoint to get the logged-in user's information
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    const { firstName, lastName, username, email } = req.body;
      
    try {
        // Find the user by their ID (you may need to adjust this based on your application's logic)
        const user = await User.findById(req.user._id);
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        // Update user fields if they're provided in the request body
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (username) user.username = username;
        if (email) user.email = email;
  
        // Save the updated user information
        await user.save();
  
        res.json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --------------------------------------------

// function for Product -----------------------

const saveProduct = async (req, res) => {// post method for saving products
    // check if all required fields are provided
    if (
        !req.body.productName || 
        !req.body.productType || 
        !req.body.productPrice || 
        !req.body.productDescription || 
        !req.body.productQuantity
    ) {
        res.json({ success: false, message: 'All required fields must be provided' });
        return;
    }
    
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save(); // inorganize ko lang
    
    if (savedProduct) {
        res.json({ success: true, product: savedProduct });
    } else {
        res.json({ success: false, message: 'Error saving product' });
    }
};

const updateQty = async (req, res) => {                 // post method for decreasing product quantity
    res.json(await Product.updateOne(
        {productID: req.body.productID}, 
        {$inc: {productQuantity: -1}}
    ))
};

const getAllProducts = async (req, res) => {            // get method for getting all products
    const products = await Product.find();
    
    if (products.length > 0){
        res.json(products);
    }
    else{
        res.json({});
    }
};

const removeProduct = async (req, res) => {    //delete a product by product ID
    res.send(await Product.deleteOne({ productID: req.body.productID}))
}

const addProduct = async (req, res) => {
    try {
      // Extract product details from request body
      const { productName, productType, productPrice, productDescription, quantity } = req.body;
  
      // Check if any field is empty
      if (!productName || !productType || !productPrice || !productDescription || !quantity) {
        return res.status(400).json({ message: 'All fields are required' });
      }      
        
      // Create new product instance
      const newProduct = new Product({ productName, productType, productPrice, productDescription, quantity });
  
      // Save product to database
      const savedProduct = await newProduct.save();
  
      // Send response
      res.status(201).json({ message: 'Product added successfully', product: savedProduct }); // Return the saved product object
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --------------------------------------------


// functions for Order ------------------------
const saveOrder = async (req, res) => {                 // post method for saving orders
    if (
        !req.body.transactionID ||
        !req.body.productIDs ||
        !req.body.productNames ||
        !req.body.orderQuantity ||
        !req.body.orderStatus ||
        !req.body.email ||
        !req.body.dateOrdered ||
        !req.body.timeOrdered
    ){
        res.json({ success: false, message: 'All required fields must be provided' });
        return;
    }

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save(); // inorganize ko lang
    
    if (savedOrder) {
        res.json({ success: true, order: savedOrder });
    } else {
        res.json({ success: false, message: 'Error saving order' });
    }
};

const updateStatus = async (req, res) => {              // post method for updating status
    res.json(await Order.updateOne({transactionID: req.body.transactionID}, {$set: {orderStatus: req.body.orderStatus}}))
};

const getAllOrders = async (req, res) => {              // get method for getting all orders
    const orders = await Order.find();
    
    if (orders.length > 0){
        res.json(orders);
    }
    else{
        res.json({});
    }
};
// --------------------------------------------

export {
    customerSignup, customerLogin, adminLogin, getUsers,
    updateCart, getCart, getTotalQty, getTotalPrice, authenticateToken, getUserProfile, updateUser,
    saveProduct, updateQty, getAllProducts, removeProduct, addProduct, deleteProduct,
    saveOrder, updateStatus, getAllOrders
}