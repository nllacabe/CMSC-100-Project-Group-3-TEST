import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './stylesheets/customer.css';
import './stylesheets/admin.css';
import './stylesheets/signup-login.css';

import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Root from './pages/Root';
import Shop from './pages/Shop';
import OrderSummary from './pages/OrderSummary';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import RootAdmin from './pages/RootAdmin';
import Users from './pages/Users';
import Listings from './pages/Listings';
import Fulfillment from './pages/Fulfillment';
import Sales from './pages/Sales';

const router = createBrowserRouter([
  { path: '/', element: <Signup />},
  { path: '/login', element: <Login /> }, // route for the login page
  { path: '/login-admin', element: <AdminLogin /> },
  { path: '/root', element: <Root />, children: [
    { path: 'shop', element: <Shop /> },
    { path: 'order-summary', element: <OrderSummary /> },
    { path: 'orders', element: <Orders /> },
    { path: 'profile', element: <Profile /> }
  ]},

  { path: '/admin-dashboard', element: <AdminDashboard /> }, // route for the admin dashboard
  { path: '/root-admin', element: <RootAdmin />, children: [
    { path: 'users', element: <Users /> }, // route for user management
    { path: 'listings', element: <Listings /> }, // route for product listings
    { path: 'fulfillment', element: <Fulfillment /> },
    { path: 'sales', element: <Sales /> }
  ]},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
