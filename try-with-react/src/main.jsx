import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Root from './pages/Root';
import Shop from './pages/Shop';
import OrderSummary from './pages/OrderSummary';
import Orders from './pages/Orders';


const router = createBrowserRouter([
  { path: '/', element: <Root />, children: [
    { path: '/', element: <Shop /> },
    { path: '/order-summary', element: <OrderSummary /> },
    { path: '/orders', element: <Orders /> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
