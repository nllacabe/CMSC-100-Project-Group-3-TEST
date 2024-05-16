import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
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

    return (
        <>
        <div className='user-div'>
            <h1>User Information</h1>
            {user && (
                <div>
                    <p>First Name: {user.firstName} </p>
                    <p>Last Name: {user.lastName}</p>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
        </>
    );
}
