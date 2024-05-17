import {
    saveUser, 
    saveProduct, updateQty, removeProduct, getAllProducts, 
    saveOrder, updateStatus, getAllOrders, 
} from './controller.js'

const router = (app) =>{
    app.post('/save-user', saveUser)                    // user

    app.post('/save-product', saveProduct)              // product
    app.post('/update-qty', updateQty)
    app.post('/remove-product', removeProduct)
    app.get('/get-all-products', getAllProducts)

    app.post('/save-order', saveOrder)                  // order
    app.post('/update-status', updateStatus)
    app.get('/get-all-orders', getAllOrders)
}

export default router;