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
      fetch('http://localhost:3000/save-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          transactionID: uuidv4(),
          productIDs: cart.map(item => item.productID),
          orderQuantity: cart.map(item => item.count),
          orderStatus: "0",
          email: "email@gmail.com",
          dateOrdered: Date(),
          timeOrdered: moment().format('HH:mm:ss')
        })
      })
    }
    setOrderPlaced(false);
  }, [orderPlaced])

  return (
    <>
     <div className="order-summary-container">
        <button><Link to={`/root/shop`}>Back To Cart</Link></button>
        <p>Total Quantity of Items: {totalItems}</p>
        <h1>Order Summary</h1>
        <table>
          <tr>
            <th></th>
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
        <p>Total Price: {totalPrice}</p>
        <p>Mode of Payment: cash on delivery</p>
        <button onClick={() => setOrderPlaced(true)}>Place Order</button>
    </div>
    </>
  )
}