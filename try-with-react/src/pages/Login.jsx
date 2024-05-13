import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                alert(`Login failed: ${responseData.message}`);
            } else {
                //alert("Login successful");
                navigate(`/root/shop`);  //navigate to shop page
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='App'>
            <div className='Signup'>
                <div className='Signup-Card'>
                    <form onSubmit={handleSubmit}>
                        <center><h2>Login</h2></center>
                        <div className='form-group'>
                            <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                        </div>
                        <div className='form-group'>
                            <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        </div>
                        <button type='submit'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}