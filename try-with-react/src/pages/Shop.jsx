import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Popup from './Popup';

export default function Shop() {

  const [items, setItems] = useState([])
  const [totalItems, setTotal] = useState(0);             // useState for totalItems (initial is 0)
  const [totalPrice, setPrice] = useState(0);
  const [cart, setCart] = useState([]);                   // useState for cart (initial is an empty list)
  const [showPopup, setShowPopup] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/get-all-products')
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

  function openPopup(index){
    setShowPopup(index);
  }

  function closePopup(){
    setShowPopup(null);
  }

  const stringifiedCart = JSON.stringify(cart);

  return (
    <main>
      <div className="products-part">
        <div className="view-container">
          <div className="view">
            <span>Order by:</span>
            <button>Ascending</button>
            <button>Descending</button>

          </div>
          <div className="view">
            <span>Sort by:</span>
            <button>Name</button>
            <button>Type</button>
            <button>Price</button>
            <button>Quantity</button>
          </div>
        </div>
        <div className="product-container">
          {items.map((item, index) =>
              <div className="product">
                <img src={item.productImg} className="product-img"></img>
                <p className="product-name">{item.productName}</p>
                <p className="product-price">P{item.productPrice}.00</p>
                <button onClick={() => openPopup(index)} className="product-desc">View description &gt;</button>
                <div className="popup">
                  {showPopup == index && <Popup description={item.productDescription} closePopup={closePopup} />}
                </div>
                <button onClick={() => addToCart(item)} className="product-add-btn">Add To Cart</button>
              </div>
          )}
        </div>
      </div>
      <div className="cart">
        <p className="cart-title">Shopping Cart</p>
        {cart.map((prod) => {
          return <div key = {prod.productID} className="cart-item">
            <div className="cart-left">
                <p className="cart-name">{prod.productName}&nbsp;</p>
                <p className="cart-price">- P{prod.productPrice}.00</p>
            </div>
            <div className="cart-right">
                <p className="cart-count">x {prod.count}</p>
                <button className="cart-delete-btn" onClick={() => deleteFromCart(prod)}>X</button>
            </div>
          </div>
        })}
      </div>
      <div className="cart-info">
        <p className="cart-total">Total items: {totalItems}</p>
        <p className="cart-subtotal">Subtotal: Php {totalPrice}.00</p>
        <button hidden={!cart.length > 0} className="cart-checkout-btn"><Link to={`/order-summary?list=${stringifiedCart}&count=${totalItems}&price=${totalPrice}`} className="cart-checkout-text">Check Out</Link></button>
      </div>
    </main>
  )
}