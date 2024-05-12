import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Root from './pages/Root';
import Shop from './pages/Shop';
import OrderSummary from './pages/OrderSummary';


const router = createBrowserRouter([
  { path: '/', element: <Root />, children: [
    { path: '/', element: <Shop /> },
    { path: '/order-summary', element: <OrderSummary /> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
