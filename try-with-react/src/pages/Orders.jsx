import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderCanceled, setOrderCanceled] = useState(false);
  const [idToCancel, setIdToCancel] = useState('');

  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const getUserInfo = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (!token) {
            setError('User is not logged in');
            setLoading(false);
            return;
        }
        try {
            const userData = await getUserInfo(token);
            setUser(userData);
        } catch (err) {
            setError('Failed to fetch user info');
        } finally {
            setLoading(false);
        }
    };
    fetchUserInfo();
  }, []);

  if(user){
    setEmail(user.email);
    setUser(false);
  }


  useEffect(() => {
    if(email.length > 0){
      fetch('http://localhost:3000/get-all-orders')
        .then(response => response.json())
        .then(body => {
          setOrders(body.filter(order => order.email == email))
        })
    }

    if(orderCanceled){
        fetch('http://localhost:3000/update-status',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            transactionID: idToCancel,
            orderStatus: "2"
          })
        })
      }
      setOrderCanceled(false);
  }, [user, orderCanceled])



  return (
    <>
      <div className="orders-main">
        <p className="orders-title">Orders</p>
        <div className="orders-container">
            {orders.map((item) =>
              <div className={`order ${item.orderStatus == "0" ? "order-pending" : item.orderStatus == "1" ? "order-confirmed" : "order-cancelled"}`}>
                <div>
                  <span className="order-label">Transaction ID: </span>
                  <span className="order-value">{item.transactionID}</span><br />
                  <span className="order-label">Order Status: </span>
                  <span className="order-value">{item.orderStatus == "0" ? "Pending" : item.orderStatus == "1" ? "Confirmed" : "Cancelled"}</span><br />
                  <span className="order-label">Items:</span>
                  <ul className="order-items">
                    {item.productNames.map((prod, index) => (
                      <li className="order-value">{prod} — x{item.orderQuantity[index]}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="order-label">Date ordered: </span>
                  <span className="order-value">{item.dateOrdered.slice(0,10)}</span><br />
                  <span className="order-label">Time ordered: </span>
                  <span className="order-value">{item.timeOrdered}</span><br/><br/><br/>
                  <button onClick={() => {setOrderCanceled(true); setIdToCancel(item.transactionID);}} disabled={!item.orderStatus=="0"} className="cancel-order-btn">Cancel Order</button>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  )
}