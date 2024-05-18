import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export default function OrderSummary() {
  const queryString = new URLSearchParams(useLocation().search);
  const cart = JSON.parse(queryString.get('list'));
  const totalItems = JSON.parse(queryString.get('count'));
  const totalPrice = JSON.parse(queryString.get('price'));

  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if(orderPlaced){
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      fetch('http://localhost:3000/save-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in headers
        },
        body: JSON.stringify({ 
          transactionID: uuidv4(),
          productIDs: cart.map(item => item.productID),
          orderQuantity: cart.map(item => item.count),
          orderStatus: "0",
          dateOrdered: new Date().toISOString(),
          timeOrdered: moment().format('HH:mm:ss')
        })
      });
    }
    setOrderPlaced(false);
  }, [orderPlaced]);

  return (
    <>
     <div className="order-summary-container">
        <button><Link to={`/root/shop`}>Back To Cart</Link></button>
        <p>Total Quantity of Items: {totalItems}</p>
        <h1>Order Summary</h1>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Item Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.productID}>
                <td className="square-image"><img src={item.productImg} alt={item.productName}></img></td>
                <td>{item.productName}</td>
                <td>{item.productPrice}</td>
                <td>{item.count}</td>
                <td>{item.productPrice * item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total Price: {totalPrice}</p>
        <p>Mode of Payment: cash on delivery</p>
        <button onClick={() => setOrderPlaced(true)}>Place Order</button>
    </div>
    </>
  )
}
