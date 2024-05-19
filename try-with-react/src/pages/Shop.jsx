import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Popup from './Popup';
import axios from 'axios';

export default function Shop() {

  const [items, setItems] = useState([])
  const [totalItems, setTotal] = useState(0);             // useState for totalItems (initial is 0)
  const [totalPrice, setPrice] = useState(0);
  const [cart, setCart] = useState([]);                   // useState for cart (initial is an empty list)
  
  const [showPopup, setShowPopup] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortKey, setSortKey] = useState("productName");
  const [ascClicked, setAsc] = useState(true);
  const [descClicked, setDesc] = useState(false);
  const [nameClicked, setSortName] = useState(true);
  const [typeClicked, setSortType] = useState(false);
  const [priceClicked, setSortPrice] = useState(false);
  const [qtyClicked, setSortQty] = useState(false);

  const [cartModified, setCartModified] = useState(false);
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

    fetch('http://localhost:3000/get-all-products')
      .then(response => response.json())
      .then(body => {
        setItems(body)
    })

    if(email.length > 0){
      fetch(`http://localhost:3000/get-cart?email=${email}`)
        .then(response => response.json())
        .then(body => {
          setCart(body[0].shoppingCart)
      })

      fetch(`http://localhost:3000/get-qty?email=${email}`)
        .then(response => response.json())
        .then(body => {
          setTotal(body[0].totalQty)
      })

      fetch(`http://localhost:3000/get-price?email=${email}`)
        .then(response => response.json())
        .then(body => {
          setPrice(body[0].totalPrice)
      })
    }

    if(cartModified){
      fetch('http://localhost:3000/update-cart',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email,      // dapat specific email
          shoppingCart: cart,
          totalQty: totalItems,
          totalPrice: totalPrice
        })
      })
    }
    setCartModified(false);

  }, [user, cartModified])


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
      const countField = {...item, count: 1, totalQty: 0, totalPrice: 0};         // adds a new field to the object (count: 1)
      setCart([...cart, countField]);                 // appends the object to the cart list
      setPrice(totalPrice+countField.productPrice);
    }

    setCartModified(true)
  }

  function deleteFromCart(deleteItem) {           // delete function
    setTotal(totalItems-deleteItem.count);                              // subtracts the item count from the total item count
    const newCart = cart.filter(item => item.productID !== deleteItem.productID);     // filters out the item to be deleted
    setCart(newCart);
    setPrice(totalPrice-(deleteItem.productPrice*deleteItem.count));
    setCartModified(true)
  }

  function openPopup(index){
    setShowPopup(index);
  }

  function closePopup(){
    setShowPopup(null);
  }

  const sortedProducts = [...items].sort((a, b) => {
    if (!a[sortKey] || !b[sortKey]) return 0;
    if (sortKey === 'productPrice' || sortKey === 'productQuantity') {
      // Sort numeric values
      return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
    } else {
      // Sort string values
      const x = a[sortKey].toString().toLowerCase();
      const y = b[sortKey].toString().toLowerCase();
      return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
    }
  });

  const stringifiedCart = JSON.stringify(cart);


  
  return (
    <main>
      <div className="products-part">
        <div className="view-container">
          <div className="view">
            <span>Order by:</span>
            <button onClick={() => {setSortOrder("asc"); setAsc(true); setDesc(false)}} className={ascClicked ? "clicked" : "initial"}>Ascending</button>
            <button onClick={() => {setSortOrder("desc"); setAsc(false); setDesc(true)}} className={descClicked ? "clicked" : "initial"}>Descending</button>

          </div>
          <div className="view">
            <span>Sort by:</span>
            <button onClick={() => {setSortKey("productName"); setSortName(true); setSortType(false); setSortPrice(false); setSortQty(false);}} className={nameClicked ? "clicked" : "initial"}>Name</button>
            <button onClick={() => {setSortKey("productType"); setSortName(false); setSortType(true); setSortPrice(false); setSortQty(false);}} className={typeClicked ? "clicked" : "initial"}>Type</button>
            <button onClick={() => {setSortKey("productPrice"); setSortName(false); setSortType(false); setSortPrice(true); setSortQty(false);}} className={priceClicked ? "clicked" : "initial"}>Price</button>
            <button onClick={() => {setSortKey("productQuantity"); setSortName(false); setSortType(false); setSortPrice(false); setSortQty(true);}} className={qtyClicked ? "clicked" : "initial"}>Quantity</button>
          </div>
        </div>
        <div className="product-container">
          {sortedProducts.map((item, index) =>
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
        <button hidden={!cart.length > 0} className="cart-checkout-btn"><Link to={`/root/order-summary?list=${stringifiedCart}&count=${totalItems}&price=${totalPrice}`} className="cart-checkout-text">Check Out</Link></button>
      </div>
    </main>
  )
}