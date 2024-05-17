import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

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

    const handleEdit = () => {
        setEditedUser({ ...user });
        setEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:3000/profileEdit', editedUser, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(editedUser);
            setEditing(false);
            alert('User information updated successfully!');
        } catch (err) {
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
        <>
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
            </div>
        </>
    );
}
