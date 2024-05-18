import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not logged in');
        navigate('/login');
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
  }, [navigate]);

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
          </div>
        ))}
      </div>
    </div>
  );
}
