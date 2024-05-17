import { useState, useEffect } from "react";

const Fulfillment = () => {
    
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [orderToApprove, setOrderToApprove] = useState({});

    useEffect(() => {
        fetch('http://localhost:3000/get-all-orders')
            .then(response => response.json())
            .then(body => {
                setOrders(body)
            })

        fetch('http://localhost:3000/get-all-products')
            .then(response => response.json())
            .then(body => {
                setProducts(body)
            })
    }, []); 

    return (
        <>
            <div className="fulfillment-main">
                <div className="fulfillment-order-list">
                    <h1>Fulfillment</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Date Ordered</th>
                                <th>Time Ordered</th>
                                <th>Approve?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => 
                                <tr key={index}>
                                    <td>{order.transactionID}</td>
                                    <td>{order.dateOrdered.slice(0,10)}</td>
                                    <td>{order.dateOrdered.slice(11,19)}</td>
                                    <td>
                                        <button onClick={()=>{
                                            setOrderToApprove(orders[index]);
                                        }}>Approve</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="fulfillment-product-list">
                    <h1>Products</h1>
                    <table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Product Price</th>
                                    <th>Order Quantity</th>
                                    <th>Item Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderToApprove.productIDs && orderToApprove.productIDs.map((orderProductId, index1) => {
                                    return products.map((product, index2) => {
                                        if (orderProductId === product.productID) {
                                            return (
                                                <tr key={index2}>
                                                    <td>{product.productName}</td>
                                                    <td>{product.productPrice}</td>
                                                    <td>{orderToApprove.orderQuantity[index1]}</td>
                                                    <td>{product.productPrice * orderToApprove.orderQuantity[index1]}</td>
                                                </tr>
                                            );
                                        } else {
                                            return null;
                                        }
                                    });
                                })}
                            </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Fulfillment;
