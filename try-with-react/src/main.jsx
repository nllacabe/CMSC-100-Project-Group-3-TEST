import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';

import Signup from './pages/Signup';
import Root from './pages/Root';
import Shop from './pages/Shop';
import Login from './pages/Login';
// Define the routes
const router = createBrowserRouter([
  { path: '/', element: <Signup />},
  { path: '/root', element: <Root />, children: [
    { path: 'shop', element: <Shop /> },
    // Add other children routes of Root if needed
  ]},
  { path: '/login', element: <Login /> }, // route for the login page
]);


// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <Routes />
    </RouterProvider>
  </React.StrictMode>
);
