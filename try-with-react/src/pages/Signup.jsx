    import React, { useEffect, useState } from "react";
    import { Link } from 'react-router-dom';
    import axios from "axios";

    export default function Signup() {
        // const [user, setUser] = useState({
        //     firstname: '',
        //     lastname: '',
        //     username: '',
        //     email: '',
        //     password:'',
        //     userType: 'customer'
        // });

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

    
        // const handleSubmit = async (e) => {
        //     e.preventDefault();

        //     try {
        //         const response = await fetch("http://localhost:3000/signup", {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json"
        //             },
        //             body: JSON.stringify({
        //                 firstName: user.firstname,
        //                 lastName: user.lastname,
        //                 userType: user.userType,
        //                 username: user.username,
        //                 email: user.email,
        //                 password: user.password
        //             })
        //         });

        //         if (response.ok) {
        //             alert("Signup successful");
        //             setUser({
        //                 firstname: '',
        //                 lastname: '',
        //                 username: '',
        //                 email: '',
        //                 password:'',
        //                 userType: 'customer'
                        
        //             });
        //         } else {
        //             const errorData = await response.json();
        //             alert(`Signup failed: ${errorData.message}`);
        //         }
        //     } catch (error) {
        //         console.error("Error:", error);
        //         //alert("Signup failed");
        //     }
        // };

        const handleSubmit = (e) => {
            e.preventDefault();

            axios.post('http://localhost:3000/signup', { firstName, lastName, username, password, email, userType })
                .then(() => {
                    setFirstname('')
                    setLastname('')
                    setType('customer')
                    setUsername('')
                    setPassword('')
                    setEmail('')
                    fetchUsers()
                })
                .catch((e) => {
                    console.log('Unable to register user')
                })
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
                            {/* <p>or</p> */}
                            {/* <button type='submit'>Login as Merchant</button> */}
                        </form>
                    
                    </div>
                </div>
            </div>
        );
    }