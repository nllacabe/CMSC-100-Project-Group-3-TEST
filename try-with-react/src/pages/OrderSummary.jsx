import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import axios from 'axios';

export default function OrderSummary() {
  const queryString = new URLSearchParams(useLocation().search);
  const cart = JSON.parse(queryString.get('list'));
  const totalItems = JSON.parse(queryString.get('count'));
  const totalPrice = JSON.parse(queryString.get('price'));

  const [orderPlaced, setOrderPlaced] = useState(false);
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
    if(email.length > 0 && orderPlaced){
      fetch('http://localhost:3000/save-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          transactionID: uuidv4(),
          productIDs: cart.map(item => item.productID),
          productNames: cart.map(item => item.productName),
          orderQuantity: cart.map(item => item.count),
          orderStatus: "0",
          email: email,
          dateOrdered: Date(),
          timeOrdered: moment().format('HH:mm:ss')
        })
      })

      fetch('http://localhost:3000/update-cart',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email,      // dapat specific email
          shoppingCart: [],
          totalQty: 0,
          totalPrice: 0
        })
      })
    }
    setOrderPlaced(false)
  }, [user, orderPlaced])


  function showAlert(){
    alert("Order placed! Please wait for the admin to confirm your order.")
  }

  return (
    <>
     <div className="summary-container">
        <button className="summary-back-btn"><Link to={`/root/shop`} className="summary-back-text">&lt; Back To Cart</Link></button>
        <p className="summary-title">Order Summary</p>
        <div className="whole-container">
          <div className="table-container">
            <table className="summary-table">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Item Subtotal</th>
              </tr>
              {cart.map((item) =>
                  <tr>
                    <td className="square-image"><img src={item.productImg}></img></td>
                    <td>{item.productName}</td>
                    <td>{item.productPrice}</td>
                    <td>{item.count}</td>
                    <td>{item.productPrice*item.count}</td>
                  </tr>
              )}
            </table>
          </div>
          <div className="info-container">
            <span className="qty-label">Total Quantity of Items: </span>
            <span className="qty-value">{totalItems}</span><br /><br />
            <span className="price-label">Total Price: </span>
            <span className="price-value">Php {totalPrice}.00</span><br /><br />
            <span className="mop-label">Mode of Payment (MOP): </span>
            <span className="mop-value">Cash on Delivery</span><br /><br /><br />
            <button onClick={() => {setOrderPlaced(true); showAlert();}} className="place-order-btn">Place Order &gt;</button>
          </div>
        </div>
    </div>
    </>
  )
}