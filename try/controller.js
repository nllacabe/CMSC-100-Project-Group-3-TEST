// import
import mongoose from 'mongoose';

// connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/FarmToTable", {           // database name: FarmToTable
    useNewUrlParser: true, useUnifiedTopology: true
})

// define and create User model         
const User = mongoose.model('User', {
    firstName: {
      type: String,
      required: true
    },
    middleName: {
      type: String,
      default: '' // optional field, empty string if not provided
    },
    lastName: {
      type: String,
      required: true
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

// define and create Order model           
const Order = mongoose.model('Order', {
    transactionID: {
          type: String,
          unique: true // Ensure transactionID is unique
      },
      productID: {
          type: String,
      },
      orderQuantity: {
          type: Number,
      },
      orderStatus: {
          type: Number,
          enum: [0, 1, 2], // (Int: 0 Pending / 1 Completed / 2 Canceled )
      },
      email: {
          type: String,
      },
      dateOrdered: {
          type: Date,
      },
      time: {
          type: Date,
      }
}, 'orderData'); // collection name: orderData



// function for User --------------------------
const saveUser = async (req, res) => {                  // post method for saving users
    if (
        !req.body.firstName ||
        // !req.body.middleName ||
        !req.body.lastName ||
        !req.body.userType ||
        !req.body.email ||
        !req.body.password
    ){
        res.json({ success: false, message: 'All required fields must be provided' });
        return;
    }

    const newUser = new User(req.body);
    const savedUser = await newUser.save(); // inorganize ko lang
    
    if (savedUser) {
        res.json({ success: true, user: savedUser });
    } else {
        res.json({ success: false, message: 'Error saving user' });
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

// --------------------------------------------


// functions for Order ------------------------
const saveOrder = async (req, res) => {                 // post method for saving orders
    if (
        !req.body.transactionID || 
        !req.body.productID ||
        !req.body.orderQuantity ||
        !req.body.orderStatus ||
        !req.body.email ||
        !req.body.dateOrdered ||
        !req.body.time
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
    saveUser, 
    saveProduct, updateQty, getAllProducts,  removeProduct,
    saveOrder, updateStatus, getAllOrders
}