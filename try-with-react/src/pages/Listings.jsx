import React, { useState, useEffect } from 'react';

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImg, setProductImg] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [sortKey, setSortKey] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editing, setEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const fetchProducts = () => {
    fetch('http://localhost:3000/get-all-products')
      .then(response => response.json())
      .then(body => {
        setProducts(Array.isArray(body) ? body : []);
      })
      .catch(() => {
        setProducts([]);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddOrUpdateProduct = (event) => {
    event.preventDefault();
  
    const price = parseFloat(productPrice);
    const qty = parseInt(productQuantity);
  
    if (!productName || !productType || isNaN(price) || !productDescription || isNaN(qty) || qty <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }
  
    const newProduct = {
      productName,
      productType,
      productPrice: price,
      productDescription,
      productImg,
      productQuantity: qty
    };
  
    let endpoint = 'http://localhost:3000/add-product';
    let method = 'POST';
  
    if (editing && currentProductId) {
      endpoint = `http://localhost:3000/update-product/${currentProductId}`;
      method = 'PUT';
    }
    
    fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(`Product ${editing ? 'updated' : 'added'} successfully:`, data);
      setProductName('');
      setProductType('');
      setProductPrice('');
      setProductDescription('');
      setProductImg('');
      setProductQuantity('');
      setEditing(false);
      setCurrentProductId(null);
      fetchProducts();
    })
    .catch((error) => {
      console.error(`Error ${editing ? 'updating' : 'adding'} product:`, error);
    });
  };
  

  const handleEditProduct = (product) => {
    setProductName(product.productName);
    setProductType(product.productType);
    setProductPrice(product.productPrice);
    setProductDescription(product.productDescription);
    setProductImg(product.productImg);
    setProductQuantity(product.productQuantity);
    setEditing(true);
    setCurrentProductId(product._id); // Use product._id to set the current product ID
  };
  
  const handleDeleteProduct = (productId) => {
    fetch('http://localhost:3000/delete-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _method: 'DELETE', productId }) // Use productId instead of _id
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Product deleted successfully:', data);
        fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };
  

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!a[sortKey] || !b[sortKey]) return 0;
    if (sortKey === 'productPrice' || sortKey === 'productQuantity') {
      return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
    } else {
      const x = a[sortKey].toString().toLowerCase();
      const y = b[sortKey].toString().toLowerCase();
      return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
    }
  });

  return (
  <div className="product-listings-main">
    <div className="product-listings-left">
      <h1>Product Listings</h1>
      <div className="sorting-options">
        <label>Sort By: </label>
        <select value={sortKey} onChange={(e) => handleSort(e.target.value)}>
          <option value="productName">Name</option>
          <option value="productType">Type</option>
          <option value="productPrice">Price</option>
          <option value="productQuantity">Quantity</option>
        </select>
        <button onClick={() => handleSort(sortKey)}>
          Sort {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      <table className='products-table'>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Type</th>
            <th>Product Price</th>
            <th>Product Description</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.productName || ''}</td>
              <td>{product.productType || ''}</td>
              <td>${(product.productPrice || 0).toFixed(2)}</td>
              <td>{product.productDescription || ''}</td>
              <td>{product.productQuantity || ''}</td>
              <td>
                <center>
                <button className="edit-button" onClick={() => handleEditProduct(product)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                </center>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="product-listings-right">
      <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
      <form id="product-form" className="product-form" onSubmit={handleAddOrUpdateProduct}>
        <div className="input-group">
          <label htmlFor="product-name">Product Name:</label>
          <input
            type="text"
            id="product-name"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="product-type">Product Type:</label>
        </div>
        <div className="input-group">
          <select
            id="product-type"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            required
          >
            <option value="">Select Product Type</option>
            <option value="1">Staple</option>
            <option value="2">Fruits and Vegetables</option>
            <option value="3">Livestock</option>
            <option value="4">Seafood</option>
            <option value="5">Others</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="product-price">Product Price:</label>
          <input
            type="number"
            id="product-price"
            placeholder="Product price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="product-description">Product Description:</label>
          <input
            type="text"
            id="product-description"
            placeholder="Product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="product-quantity">Quantity:</label>
          <input
            type="number"
            id="product-quantity"
            placeholder="Quantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="product-img">Product Image URL:</label>
          <input
            type="text"
            id="product-img"
            placeholder="Product image URL"
            value={productImg}
            onChange={(e) => setProductImg(e.target.value)}
            required
          />
        </div>
        <button className='submit-product' type="submit">{editing ? 'Update' : 'Submit'}</button>
      </form>
    </div>
  </div>
  );
};

export default ProductListings;
