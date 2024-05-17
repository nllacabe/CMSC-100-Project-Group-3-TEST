import { useState, useEffect } from "react";

const Fulfillment = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [orderToApprove, setOrderToApprove] = useState({});
    const [approveOrder, setApproveOrder] = useState(false);

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
        if (orderToApprove.productIDs) {
            orderToApprove.productIDs.forEach((orderProductId, index1) => {
                products.forEach((product) => {
                    if (orderProductId === product.productID) {
                        total += product.productPrice * orderToApprove.orderQuantity[index1];
                    }
                });
            });
        }
        return total;
    };

    useEffect(() => {
        if (approveOrder) {
            fetch('http://localhost:3000/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transactionID: orderToApprove.transactionID,
                    orderStatus: "1"
                })
            })
                .then(response => response.json())
                .then(() => {
                    setOrders(prevOrders => prevOrders.filter(order => order.transactionID !== orderToApprove.transactionID));
                    setOrderToApprove({});
                })
                .catch(error => {
                    console.error('Error updating order status:', error);
                });
        }
        setApproveOrder(false);
    }, [approveOrder, orderToApprove.transactionID]);

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
                            {orders.filter(order => order.orderStatus === 0).map((order, index) => (
                                <tr key={index}>
                                    <td>{order.transactionID}</td>
                                    <td>{order.dateOrdered.slice(0, 10)}</td>
                                    <td>{order.dateOrdered.slice(11, 19)}</td>
                                    <td>
                                        <button onClick={() => {
                                            setOrderToApprove(order);
                                        }}>Approve</button>
                                    </td>
                                </tr>
                            ))}
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
                            {orderToApprove.productIDs && orderToApprove.productIDs.map((orderProductId, index1) => (
                                products.map((product, index2) => (
                                    orderProductId === product.productID ? (
                                        <tr key={index2}>
                                            <td>{product.productName}</td>
                                            <td>{product.productPrice}</td>
                                            <td>{orderToApprove.orderQuantity[index1]}</td>
                                            <td>{product.productPrice * orderToApprove.orderQuantity[index1]}</td>
                                        </tr>
                                    ) : null
                                ))
                            ))}
                        </tbody>
                    </table>
                    <p>Total items: {orderToApprove.productIDs ? orderToApprove.productIDs.length : 0}</p>
                    <p>Total cost: {getTotalCost()}</p>
                    <button onClick={() => { setApproveOrder(true); }}>Confirm approval</button>
                </div>
            </div>
        </>
    );
};

export default Fulfillment;
