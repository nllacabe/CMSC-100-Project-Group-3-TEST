import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function Signup() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password:''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
                

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password
                })
            });

            if (response.ok) {
                alert("Signup successful");
                setUser({
                    username: '',
                    email: '',
                    password: ''
                });
            } else {
                const errorData = await response.json();
                alert(`Signup failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            //alert("Signup failed");
        }
    };

    return (
        <div className='App'>
            <div className='Signup'>
                <div className='Signup-Card'>
                    <form onSubmit={handleSubmit}>
                        <center><h2>Signup</h2></center>
                        <div className='form-group'>
                            <input type='text' name='username' value={user.username} onChange={(e) => setUser({...user, username: e.target.value})}  placeholder='Username' />
                        </div>
                        <div className='form-group'>
                            <input type='email' name='email' value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}  placeholder='Email' />
                        </div>
                        <div className='form-group'>
                            <input type='password' name='password' value={user.password} onChange={(e) => setUser({...user, password: e.target.value})}  placeholder='Password' />
                        </div>
                        <p>Already have an account? <Link to={`/login`}>Login</Link></p>
                        <button type='submit'>Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}