import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            const { token, message } = response.data;
    
            if (token) {
                alert(message);
                localStorage.setItem('token', token); 
                navigate(`/root/shop`);  // Navigate to shop page
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error:', error);
            // Show specific error message in an alert box
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            }    
        }
    };

    return (
        <div className='SignupPage'>
            <div>
                <div className='Signup-Card'>
                    <form onSubmit={handleSubmit}>
                        <center><p className="auth-title">Log-in</p></center>
                        <div className='form-group'>
                            <input className="auth-input" type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                        </div>
                        <div className='form-group'>
                            <input className="auth-input" type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        </div>
                        <br/>
                        <button className="auth-submit-btn" type='submit'>Login</button><br/><br/>
                        <button className="auth-back-btn"><Link to={`/`} className="auth-back-text">Back</Link></button>
                    </form>
                </div>
            </div>
        </div>
    );
}
