import React, { useState, useEffect } from 'react';
import axios from 'axios';
import usersImage from '../assets/users.png';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/signup');
                const customers = response.data.filter(user => user.userType === 'customer');
                setUsers(customers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className='container'>
        <div className='user-container'>
            <h1>User Accounts</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul>
                        {users.map(user => (
                            <li key={user._id} className='user-item'>
                            <img src={usersImage} alt="User" className="user-image" />
                            <div className='user-info'>
                                <div className='user-fullname'>{user.firstName} {user.lastName}</div>
                                <div className='user-email'><strong>Email:</strong> {user.email}</div>
                                <div className='username'><strong>Username:</strong> {user.username}</div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    <p>Total Users: {users.length}</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default Users;
