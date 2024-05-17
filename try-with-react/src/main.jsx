
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom';
import './index.css';


import Root from './pages/Root';
import Shop from './pages/Shop';
import OrderSummary from './pages/OrderSummary';
import Orders from './pages/Orders';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminRoot from './pages/RootAdmin';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Listings from './pages/Listings';
import Fulfillment from './pages/Fulfillment';
import Sales from './pages/Sales';


// const router = createBrowserRouter([
//   { path: '/', element: <Root />, children: [
//     { path: '/', element: <Shop /> },
//     { path: '/order-summary', element: <OrderSummary /> },
//     { path: '/orders', element: <Orders /> }
//   ]}
// ])



const router = createBrowserRouter([
  { path: '/', element: <Signup />},
  { path: '/login', element: <Login /> }, // route for the login page
  { path: '/login-admin', element: <AdminLogin /> },
  { path: '/root', element: <Root />, children: [
    { path: 'shop', element: <Shop /> },
    { path: 'orders', element: <Orders />},
    { path: 'profile', element: <Profile />},
    // Add other children routes of Root if needed
  ]},
  { path: '/order-summary', element: <OrderSummary />},
  // admin
  { path: '/root-admin', element: <AdminRoot />, children: [
    { path: 'fulfillment', element: <Fulfillment /> },
  ]},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
