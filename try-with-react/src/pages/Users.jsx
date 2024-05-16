import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            <h2>User Accounts</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <p>Total Users: {users.length}</p>
                    <ul>
                        {users.map(user => (
                            <li key={user._id}>
                                {user.firstName} {user.lastName} - {user.email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Users;
