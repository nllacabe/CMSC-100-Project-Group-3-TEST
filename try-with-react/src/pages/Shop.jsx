import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Shop() {

  const [items, setItems] = useState([])
  const [totalItems, setTotal] = useState(0);             // useState for totalItems (initial is 0)
  const [totalPrice, setPrice] = useState(0);
  const [cart, setCart] = useState([]);                   // useState for cart (initial is an empty list)

  useEffect(() => {
    fetch('http://localhost:3000/get-all-products')
      .then(response => response.json())
      .then(body => {
        setItems(body)
      })
  })

  function addToCart(item) {                    // add to cart function
    setTotal(totalItems+1);                     // increments totalItems

    let flag = 0;
    for(const product of cart){                 // iterates through the cart list
      if(product.productID == item.productID){                // if the item is already in the list
        flag++;                                 // increments flag
        product.count++;                        // increments the product count
        setPrice(totalPrice+product.productPrice);
        break;
      }
    }
    if(flag == 0){                                    // if the item is not in the list yet
      const countField = {...item, count: 1};         // adds a new field to the object (count: 1)
      setCart([...cart, countField]);                 // appends the object to the cart list
      setPrice(totalPrice+countField.productPrice);
    }
  }

  function deleteFromCart(deleteItem) {           // delete function
    setTotal(totalItems-deleteItem.count);                              // subtracts the item count from the total item count
    const newCart = cart.filter(item => item.productID !== deleteItem.productID);     // filters out the item to be deleted
    setCart(newCart);
    setPrice(totalPrice-(deleteItem.productPrice*deleteItem.count));
  }

  const stringifiedCart = JSON.stringify(cart);

  return (
    <>
      <main>
        <div className="item-part">
          <div className="card-container">
            {items.map((item) =>
                <div className="card">
                  <img src={item.productImg} className="product-img"></img>
                  <p>{item.productID}</p>
                  <p>{item.productName}</p>
                  <p>₱{item.productPrice}.00</p>
                  <button onClick={() => addToCart(item)}>Add To Cart</button>
                </div>
            )}
          </div>
        </div>
        <div className="cart-part">
          <h2>Shopping Cart</h2>
          <p className="total">Total items: {totalItems}</p>
          {cart.map((prod) => {
            return <div key = {prod.productID} className="cart-item">
              <div className="items-left">
                  <p className="item-name">{prod.productName}&nbsp;</p>
                  <p className="item-price">- ${prod.productPrice}&nbsp;</p>
              </div>
              <div className="items-right">
                  <p className="item-count">x {prod.count}</p>
                  <button className="delete-button" onClick={() => deleteFromCart(prod)}>X</button>
              </div>
            </div>
          })}
          <div className="total-and-button">
            <p>Subtotal: {totalPrice}</p>
            <button className="checkout-button"><Link to={`/order-summary?list=${stringifiedCart}&count=${totalItems}&price=${totalPrice}`}>Check Out</Link></button>
          </div>
        </div>
      </main>
    </>
  )
}