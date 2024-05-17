import React, { useState, useEffect } from 'react';

const ProductListings = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [sortKey, setSortKey] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetch('http://localhost:3000/get-all-products')
            .then(response => response.json())
            .then(body => {
                setProducts(body);
            });
    }, []);

    // function - add a new product
    const handleAddProduct = (event) => {
        event.preventDefault();

        // convert price and quantity to numbers
        const price = parseFloat(productPrice);
        const qty = parseInt(quantity);

        // validation keme keme
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

        setProducts([...products, newProduct]);

        setProductName('');
        setProductType('');
        setProductPrice('');
        setProductDescription('');
        setQuantity('');
    };

    const handleDeleteProduct = (productName) => {
        setProducts(products.filter(product => product.productName !== productName));
    };

    // Function to handle sorting
const handleSort = (key) => {
    // Update sortKey state with the selected key
    setSortKey(key);
    // Toggle sortOrder state between 'asc' and 'desc'
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
};

// Sort products based on sortKey and sortOrder
const sortedProducts = [...products].sort((a, b) => {
    // Check if properties exist, if not return 0
    if (!a[sortKey] || !b[sortKey]) return 0;
    // Handle sorting based on different keys
    if (sortKey === 'productPrice' || sortKey === 'quantity') {
        // Sort numbers in ascending or descending order
        return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
    } else {
        // Sort strings in ascending or descending order (case-insensitive)
        return sortOrder === 'asc' ? a[sortKey].toLowerCase() > b[sortKey].toLowerCase() ? 1 : -1 
        : b[sortKey].toLowerCase() > a[sortKey].toLowerCase() ? 1 : -1;
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
                    <option value="quantity">Quantity</option>
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
                            <td>{product.productName}</td>
                            <td>{product.productType}</td>
                            <td>${product.productPrice.toFixed(2)}</td>
                            <td>{product.productDescription}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDeleteProduct(product.productName)}>Delete</button>
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
                        <option value="Poultry">Poultry</option>
                        <option value="Crops">Crops</option>
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
