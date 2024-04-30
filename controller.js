// EXER 6 TO SA 100 GINAMIT AS REFERENCE
// // import
// import mongoose from 'mongoose';

// // connect to MongoDB
// await mongoose.connect("mongodb://localhost:27017/StudentDatabase", {
//     useNewUrlParser: true, useUnifiedTopology: true
// })

// // student schema
// const Student = mongoose.model("Student", {
//     stdnum: String,
//     fname: String,
//     lname: String,
//     age: Number 
// },'studentData')

// // save a new student to the database
// const saveStudent = async (req, res) =>{
//     // checks if all required fields are met
//     if (req.body.stdnum && req.body.fname && req.body.lname && req.body.age){
//         const newStudent = new Student(req.body)
//         await newStudent.save() // saves the new student to the database
//         res.json({success: true}); // success
//     }else{
//         res.json({success: false}); // failure
//     }
  
// }

// // update a student's last name based on first name
// const updateStudent = async (req, res) => {
//     const fname = req.body.fname;
//     await Student.updateOne({ fname }, {$set: { lname: 'Parker' } });
//     res.json({ updated: true });
// }

// // remove a user
// const removeUser = async (req, res) => {
//     await Student.deleteOne({ stdnum: req.body.stdnum });
//     res.json({ deleted: true });
// }

// // remove all users from the database
// const removeAllUsers = async (req, res) => {
//     const result = await Student.deleteMany();
//     if (result.deletedCount > 0) {
//         res.json({ deleted: true });
//     } else {
//         res.json({ deleted: false });
//     }
// }

// // get a user by student number
// const getUser = async (req, res) => {
//     const user = await Student.find({ stdnum: req.query.stdnum });
//     if (user.length > 0) {
//      res.json(user);   
//     } else {
//         res.json([]);
//     }
    
// }

// // get all members in the database
// const getAllMembers = async (req, res) => {
//     const members = await Student.find();
//     if (members.length > 0) {
//         res.json(members);
//     } else {
//         res.json([]);
//     }
// }

// // export functions
// export { saveStudent, updateStudent, removeUser, removeAllUsers, getUser, getAllMembers };

// import
import mongoose from 'mongoose';

// connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/StudentDatabase", {
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
}, 'userData'); 

// define and create Product model
const Product = mongoose.model('Product', {
    productName: {
      type: String,
    },
    productType: {
      type: Number,
      enum: [1, 2, 3, 4, 5], //(Int: 1 Staple/2 Fruits and Vegetables/ 3 Livestock/ 4 Seafood/ 5 Others)
    },
    productPrice: {
      type: Number,
    },
    productDescription: {
      type: String,
    },
    productQuantity: {
      type: Number,
    }
  }, 'productData'); 


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
  }, 'orderTransaction'); 



// function - create a new product
const saveProduct = async (req, res) => {
  // check if all required fields are provided
  if (!req.body.productName || !req.body.productType || !req.body.productPrice || !req.body.productDescription || !req.body.productQuantity) {
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

// function - get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find();
  
  if (products.length > 0) {
      res.json(products);
  } else {
      res.json([]);
  }
};

// export functions
// export { };
