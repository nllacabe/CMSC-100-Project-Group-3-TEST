import {
    saveProduct, updateQty, removeProduct, getAllProducts, 
    saveOrder, updateStatus, getAllOrders, getUsers, customerLogin,
    customerSignup, addUserShoppingCart, adminLogin, authenticateToken,
    getUserProfile
} from './controller.js'


export default function router(app) {

	// Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
  })
  
  app.post('/signup', customerSignup)   
  app.get('/signup', getUsers)                 // user
  app.get('/profile', authenticateToken, getUserProfile);
  app.post('/shoppingCart',  addUserShoppingCart)
  app.post('/login', customerLogin)
  app.post('/login-admin', adminLogin)
  app.post('/save-product', saveProduct)              // product
  app.post('/update-qty', updateQty)
  app.post('/remove-product', removeProduct)
  app.get('/get-all-products', getAllProducts)

  app.post('/save-order', saveOrder)                  // order
  app.post('/update-status', updateStatus)
  app.get('/get-all-orders', getAllOrders)
}