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
    <div className='ProfilePage'>
        <div className='user-div'>
            <h1>MY PROFILE</h1>
            {user && !editing && (
                <div>
                    <p> <strong>Name:</strong> {user.firstName} {user.lastName} </p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button onClick={handleEdit}>Edit Info</button>
                </div>
            )}
            {editing && (
                <div>
                    <p>First Name: <input type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange} /></p>
                    <p>Last Name: <input type="text" name="lastName" value={editedUser.lastName} onChange={handleInputChange} /></p>
                    <p>Username: <input type="text" name="username" value={editedUser.username} onChange={handleInputChange} /></p>
                    <p>Email: <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} disabled/></p>
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </div>

        <div className='orders-div'>
            <h2>Purchase History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Date Ordered</th>
                        <th>Time Ordered</th>
                        <th>Item Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.transactionID}>
                            <td>{order.transactionID}</td>
                            <td>{new Date(order.dateOrdered).toLocaleDateString()}</td>
                            <td>{order.timeOrdered}</td>
                            <td>{order.itemQuantity}</td>
                            <td>{order.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
}
