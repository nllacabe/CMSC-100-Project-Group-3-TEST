import { useState, useEffect } from "react";

const Sales = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [orderToView, setOrderToView] = useState({});

    useEffect(() => {
        fetch('http://localhost:3000/get-all-orders')
            .then(response => response.json())
            .then(body => {
                setOrders(body);
            });

        fetch('http://localhost:3000/get-all-products')
            .then(response => response.json())
            .then(body => {
                setProducts(body);
            });
    }, []);

    const getTotalCost = () => {
        let total = 0;
        if (orderToView.productIDs) {
            orderToView.productIDs.forEach((orderProductId, index1) => {
                products.forEach((product) => {
                    if (orderProductId === product.productID) {
                        total += product.productPrice * orderToView.orderQuantity[index1];
                    }
                });
            });
        }
        return total;
    };

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
                                <th>View Order Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(order => order.orderStatus === 1).map((order, index) => (
                                <tr key={index}>
                                    <td>{order.transactionID}</td>
                                    <td>{order.dateOrdered.slice(0, 10)}</td>
                                    <td>{order.dateOrdered.slice(11, 19)}</td>
                                    <td>
                                        <button onClick={() => {
                                            setOrderToView(order);
                                        }}>View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="fulfillment-product-list">
                    <h1>Products</h1>
                    {Object.keys(orderToView).length !== 0 && (
                        <div>
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
                                    {orderToView.productIDs && orderToView.productIDs.map((orderProductId, index1) => (
                                        products.map((product, index2) => (
                                            orderProductId === product.productID ? (
                                                <tr key={index2}>
                                                    <td>{product.productName}</td>
                                                    <td>{product.productPrice}</td>
                                                    <td>{orderToView.orderQuantity[index1]}</td>
                                                    <td>{product.productPrice * orderToView.orderQuantity[index1]}</td>
                                                </tr>
                                            ) : null
                                        ))
                                    ))}
                                </tbody>
                            </table>
                            <p>Total items: {orderToView.productIDs ? orderToView.productIDs.length : 0}</p>
                            <p>Total cost: {getTotalCost()}</p>
                            <button onClick={() => { setOrderToView({}); }}>Remove view</button>
                        </div>  
                    )}
                </div>
            </div>
        </>
    );
};

export default Sales;
