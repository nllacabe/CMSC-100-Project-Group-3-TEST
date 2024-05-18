import React, { useState, useEffect } from 'react';

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sortKey, setSortKey] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchProducts = () => {
    fetch('http://localhost:3000/get-all-products')
      .then(response => response.json())
      .then(body => {
        if (Array.isArray(body)) {
          setProducts(body);
        } else {
          console.error('Response is not an array:', body);
          setProducts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setProducts([]);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (event) => {
    event.preventDefault();

    const price = parseFloat(productPrice);
    const qty = parseInt(quantity);

    if (!productName || !productType || isNaN(price) || !productDescription || isNaN(qty) || qty <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const newProduct = {
      productName,
      productType,
      productPrice: price,
      productDescription,
      quantity: qty
    };

    fetch('http://localhost:3000/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Add Content-Type header
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then(() => {
        console.log('Product added successfully');
        setProductName('');
        setProductType('');
        setProductPrice('');
        setProductDescription('');
        setQuantity('');
        fetchProducts(); // Fetch all products again to update the listing
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  };

  const handleDeleteProduct = (productId) => {
    fetch('http://localhost:3000/remove-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    })
      .then(() => {
        console.log('Product deleted successfully');
        fetchProducts(); // Fetch all products again to update the listing
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };
  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };
  
  // aayusin ko pa
  const sortedProducts = [...products].sort((a, b) => {
    if (!a[sortKey] || !b[sortKey]) return 0;
    if (sortKey === 'productPrice' || sortKey === 'quantity') {
      // Sort numeric values
      return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
    } else {
      // Sort string values
      const x = a[sortKey].toString().toLowerCase();
      const y = b[sortKey].toString().toLowerCase();
      return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
    }
  });
  
  return (
    <div className="product-listings-main">
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
      <table>
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
        <button className="delete-btn" onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      <form id="product-form" className="form" onSubmit={handleAddProduct}>
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
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductListings;
