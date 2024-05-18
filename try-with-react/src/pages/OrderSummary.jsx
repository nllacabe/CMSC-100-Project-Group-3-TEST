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
      fetch('http://localhost:3001/save-order',
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
          email: "email@gmail.com",
          dateOrdered: Date(),
          timeOrdered: moment().format('HH:mm:ss')
        })
      })
    }
    setOrderPlaced(false)
  }, [orderPlaced])

  function showAlert(){
    alert("Order placed! Please wait for the admin to confirm your order.")
  }

  return (
    <>
     <div className="summary-container">
        <button className="summary-back-btn"><Link to={`/`} className="summary-back-text">&lt; Back To Cart</Link></button>
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