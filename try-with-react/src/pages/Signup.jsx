    import React, { useEffect, useState } from "react";
    import { Link } from 'react-router-dom';
    import axios from "axios";
    import { v4 as uuidv4 } from 'uuid';

    export default function Signup() {

        const [user, setUser]   = useState([])
        const [firstName, setFirstname] = useState('')
        const [lastName, setLastname] = useState('')
        const [userType, setType] = useState('customer')
        const [username, setUsername] = useState('')
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        useEffect(() =>  {
            fetchUsers();
        }, [])

        const fetchUsers = () => {
            axios.get('http://localhost:3000/signup')
            .then((res) => {
                console.log(res.data)
            })
        }


        const handleSubmit = (e) => {
            e.preventDefault();
        
            // Generate a unique shopping cart ID
            const shoppingCartId = uuidv4();
        
            // Create the user object with signup information
            const newUser = {
                firstName,
                lastName,
                username,
                password,
                email,
                userType,
                shoppingCart: shoppingCartId // Assign the shopping cart ID to the user
            };
        
            // Create a shopping cart object
            const newShoppingCart = {
                _id: shoppingCartId,
                // Add any other properties you want for the shopping cart
                items: [],
                quantity: []
            };
        
            // Send requests to create user and shopping cart
            axios.post('http://localhost:3000/signup', newUser)
                .then(() => {
                    // Reset form fields after successful signup
                    setFirstname('');
                    setLastname('');
                    setType('customer');
                    setUsername('');
                    setPassword('');
                    setEmail('');
                    // Fetch users or do any other necessary actions
                    fetchUsers();
                })
                .catch((error) => {
                // Show specific error message in an alert box
                if (error.response && error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } 
                });
        
            axios.post('http://localhost:3000/shoppingCart', newShoppingCart)
                .then(() => {
                    // Perform any actions after successful shopping cart creation
                })
                .catch((error) => {
                    console.log('Unable to create shopping cart', error);
                });
        }
        

        return (
            <div className='App'>
                <div className='Signup'>
                    <div className='Signup-Card'>
                        <form onSubmit={handleSubmit}>
                            <center><h2>Signup</h2></center>
                            <div className='form-group'>
                                <input type='text' name='firstname' value={firstName} onChange={(e) => setFirstname(e.target.value)}  placeholder='First Name' />
                            </div>
                            <div className='form-group'>
                                <input type='text' name='lastname' value={lastName} onChange={(e) => setLastname(e.target.value)}  placeholder='Last Name' />
                            </div>
                            <div className='form-group'>
                                <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)}  placeholder='Username' />
                            </div>
                            <div className='form-group'>
                                <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}  placeholder='Email' />
                            </div>
                            <div className='form-group'>
                                <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}  placeholder='Password' />
                            </div>
                            <p>Already have an account? <Link to={`/login`}>Login</Link></p>
                            <button type='submit'>Sign Up</button>
                            <p>or</p>
                            <Link to="login-admin">
                            <button type='button'>Login as Merchant</button>
                        </Link>
                        </form>

                    </div>
                </div>
            </div>
        );
    }