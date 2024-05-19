import { useEffect, useState } from 'react';


export default function UserOrders() {
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not logged in');
        // navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/get-user-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };

    fetchUserOrders();
  });

  const cancelOrder = async (transactionID) => {
    try {
      const response = await fetch('http://localhost:3000/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionID: transactionID,
          orderStatus: "2"
        })
      });
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Update the order status locally after successful API call
      setOrders(orders.map(order =>
        order.transactionID === transactionID ? { ...order, orderStatus: "2" } : order
      ));
    } catch (error) {
      console.error('Failed to cancel order', error);
    }
  };

  return (
    <div className="orders-main">
      <h1>Your Orders</h1>
      <div className="orders-container">
        {orders.map((item) => (
          <div key={item.transactionID} className="order">
            <p>Transaction ID: {item.transactionID}</p>
            <p>Order Status: {item.orderStatus}</p>
            <p>Date ordered: {new Date(item.dateOrdered).toLocaleDateString()}</p>
            <p>Time ordered: {item.timeOrdered}</p>
            {item.orderStatus !== "2" && (
              <button onClick={() => cancelOrder(item.transactionID)}>Cancel Order</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
