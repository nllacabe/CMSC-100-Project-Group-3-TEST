import React from "react";
import { useState } from "react";
import axios from "axios"
export default function Signup() {
    const [username, setUsername] = useState();
    const [email, setEmail]  = useState();
    const [password, setPassword] = useState();


    const handleSubmit = (e) => {
        e.preventDefault()
        // yung may post
        
    }

return (
    <div className='App'>
      <div className='Signup'>
        <div className='Signup-Card'>
          <form onSubmit={handleSubmit}>
            <center><h2>SLogin</h2></center>
            <div className='form-group'>
              <input type='text' name='username' onChange={(e) => setUsername(e.target.value)}  placeholder='Username' />
            </div>
            <div className='form-group'>
              <input type='password' name='password' onChange={(e) => setPassword(e.target.value)}  placeholder='Password' />
            </div>
            <p>Already have an account? <a>Login</a></p>
            <button type='submit'>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}