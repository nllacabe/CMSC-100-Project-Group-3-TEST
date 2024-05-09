import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Shop() {

  const [ items, setItems ] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/get-all-products')
      .then(response => response.json())
      .then(body => {
        setItems(body)
      })
  })

  return (
    <>
      <main>
        <div className="item-part">
          <div className="card-container">
            {items.map((item, i) =>
                <div className="card">
                  <p>{item.productName}</p>
                  <p>₱{item.productPrice}.00</p>
                </div>
            )}
          </div>
        </div>
        <div className="cart-part">
          <h2>Shopping Cart</h2>
        </div>
      </main>
    </>
  )
}