import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios"
import { Outlet, Link } from 'react-router-dom';
import mongoose from "mongoose";

export default function Signup() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password:''
    })
    // const [username, setUsername] = useState();
    // const [email, setEmail]  = useState('');
    // const [password, setPassword] = useState('');

    // useEffect(() => {
    //     fetchUsers();
    //   } ,[])

    // const fetchUsers = () => {
    //     fetch('http://localhost:3001/saveUser')
    //       .then(response => response.json())
    //       .then(body => {
    //         setUsers(body)
    //       })
    // }
    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //    post('http://localhost:3001/saveUser', {email, username, password})
    //    .then(() => {
    //     alert('Successful')
    //     setEmail('')
    //     setUsername('')
    //     setPassword('')
    //     fetchUsers()
    //     //navigate('/login')
    
    //    })

    // }

    async function handleSubmit(e) {
      e.preventDefault();
      try {
        await axios.post("http://localhost:3000/signup", { 
          username: user.username, 
          email: user.email, 
          password: user.password 
        });
        alert('Signup successful');
        // Reset the form fields after successful signup
        setUser({
          username: '',
          email: '',
          password: ''
        });
      } catch (error) {
        console.log(error.response.data); // Log the error response from the server
        alert('Signup failed');
      }
    }
    
  

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
            <p>Already have an account? <a>Login</a></p>
            {/* <Link to="/login">Login Page</Link> */}
            <button type='submit'>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}