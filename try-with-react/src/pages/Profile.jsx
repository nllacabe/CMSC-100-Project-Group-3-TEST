import React, { useState, useEffect } from 'react';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [orders, setOrders] = useState([]);

    const getUserInfo = async (token) => {
        const response = await fetch('http://localhost:3000/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        return response.json();
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User is not logged in');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo(token);
                setUser(userData);
            } catch (err) {
                console.error('Failed to fetch user info', err);
            }
        };

        fetchUserData();

        const fetchUserOrders = async () => {
            try {
              const response = await fetch('http://localhost:3000/get-completed-orders', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (!response.ok) {
                throw new Error('Failed to fetch orders');
              }
              const data = await response.json();
              setOrders(data);
            } catch (error) {
              console.error('Failed to fetch orders', error);
            }
          };
      
          fetchUserOrders();

    }, []);

    const handleEdit = () => {
        setEditedUser({ ...user });
        setEditing(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/profileEdit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedUser)
            });

            if (!response.ok) {
                throw new Error('Failed to update user information');
            }

            setUser(editedUser);
            setEditing(false);
            alert('User information updated successfully!');
        } catch (err) {
            console.error('Failed to update user information', err);
            alert('Failed to update user information');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    return (
        <div className='user-div'>
            <h1>User Information</h1>
            {user && !editing && (
                <div>
                    <p>First Name: {user.firstName} </p>
                    <p>Last Name: {user.lastName}</p>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}
            {editing && (
                <div>
                    <p>First Name: <input type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange} /></p>
                    <p>Last Name: <input type="text" name="lastName" value={editedUser.lastName} onChange={handleInputChange} /></p>
                    <p>Username: <input type="text" name="username" value={editedUser.username} onChange={handleInputChange} /></p>
                    <p>Email: <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} /></p>
                    <button onClick={handleSave}>Save</button>
                </div>
            )}

            <h2>Orders</h2>
            <div>
                {orders.map((order) => (
                    <div key={order.transactionID}>
                        <p>Transaction ID: {order.transactionID}</p>
                        <p>Order Status: {order.orderStatus}</p>
                        <p>Date Ordered: {new Date(order.dateOrdered).toLocaleDateString()}</p>
                        <p>Time Ordered: {order.timeOrdered}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
