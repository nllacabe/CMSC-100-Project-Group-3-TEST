// import
import mongoose from 'mongoose';

// connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/FarmToTable", {           // database name: FarmToTable
    useNewUrlParser: true, useUnifiedTopology: true
})

// define and create User model
const User = mongoose.model('User', {
    firstName: String,
    middleName: String,
    lastName: String,
    userType: String,
    email: String,
    password: String
}, 'userData');              // collection name: userData

// define and create Product model
const Product = mongoose.model('Product', {
    productID: String,                                // added productID (wala sa previous version)
    productName: String,
    productDescription: String,
    productType: Number,                              // (Int: 1 Staple/2 Fruits and Vegetables/ 3 Livestock/ 4 Seafood/ 5 Others)
    productQuantity: Number,
    productPrice: Number                              // additional field for price (wala sa docs)
}, 'productData');           // collection name: productData

// define and create Order model
const Order = mongoose.model('Order', {
    transactionID: String,
    productID: String,
    orderQuantity: Number,
    orderStatus: Number,                              // (Int: 0 Pending / 1 Completed / 2 Canceled )
    email: String,
    dateOrdered: Date,
    time: Date
}, 'orderData');             // collection name: orderData



// function for User --------------------------
const saveUser = async (req, res) => {                  // post method for saving users
    if (req.body.firstName && req.body.middleName && req.body.lastName && req.body.userType && req.body.email && req.body.password){       // if all fields are complete, data is inserted
        const newUser = new User(req.body)
        await newUser.save()
        res.json({inserted: true});
    }
    else{
        res.json({inserted: false});
    }
};
// --------------------------------------------


// function for Product -----------------------
const saveProduct = async (req, res) => {                 // post method for saving products
    if (req.body.productID && req.body.productName && req.body.productDescription && req.body.productType && req.body.productQuantity && req.body.productPrice){       // if all fields are complete, data is inserted
        const newProduct = new Product(req.body)
        await newProduct.save()
        res.json({inserted: true});
    }
    else{
        res.json({inserted: false});
    }
};

const updateQty = async (req, res) => {                 // post method for decreasing product quantity
    res.json(await Product.updateOne({productID: req.body.productID}, {$inc: {productQuantity: -1}}))
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
// --------------------------------------------


// functions for Order ------------------------
const saveOrder = async (req, res) => {                 // post method for saving orders
    if (req.body.transactionID && req.body.productID && req.body.orderQuantity && req.body.orderStatus && req.body.email && req.body.dateOrdered && req.body.time){       // if all fields are complete, data is inserted
        const newOrder = new Order(req.body)
        await newOrder.save()
        res.json({inserted: true});
    }
    else{
        res.json({inserted: false});
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


export {saveUser, saveProduct, updateQty, getAllProducts, saveOrder, updateStatus, getAllOrders}