import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [productIDs, setProductIDs] = useState([]);
  // const [products, setProducts] = useState([]);

  const [orderCanceled, setOrderCanceled] = useState(false);
  const [idToCancel, setIdToCancel] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/get-all-orders')
      .then(response => response.json())
      .then(body => {
        setOrders(body.filter(order => order.email == "email@gmail.com"))
        setProductIDs(((body.filter(order => order.email == "email@gmail.com")).map(order => order.productIDs))[0])
      })

    // fetch('http://localhost:3001/get-all-products')
    //   .then(response => response.json())
    //   .then(body => {
    //     setProducts(body)
    //   })

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
  }, [orderCanceled])


  return (
    <>
    <div className="orders-main">
        <h1>Orders</h1>
        <div className="orders-container">
            {orders.map((item) =>
                <div className="order">
                    <p>{item.transactionID}</p>
                    <p>{item.orderStatus}</p>
                    <p>Date ordered: {item.dateOrdered.slice(0,10)}</p>
                    <p>Time ordered: {item.timeOrdered}</p>
                    <button onClick={() => {setOrderCanceled(true); setIdToCancel(item.transactionID);}}>Cancel Order</button>
                </div>
            )}
        </div>
    </div>
    </>
  )
}