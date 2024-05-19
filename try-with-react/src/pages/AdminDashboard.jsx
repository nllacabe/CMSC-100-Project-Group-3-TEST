import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <>
    <header className='admin-header'> Welcome back, Admin! </header>
    <div className='admin-dashboard-container'>
    <center>
    <div className="admin-dashboard">
      <div className="category-cards">
        {/* card for Users */}
        <Link to={`/root-admin/users`} className="category-card">
          <h2>Users</h2>
          <p>Manage user accounts</p>
        </Link>

        {/* card for Listings */}
        <Link to={`/root-admin/listings`} className="category-card">
          <h2>Listings</h2>
          <p>Manage product listings</p>
        </Link>

        {/* card for Fulfillment */}
        <Link to={`/root-admin/fulfillment`} className="category-card">
          <h2>Fulfillment</h2>
          <p>Process and fulfill orders</p>
        </Link>

        {/* card for Sales */}
        <Link to={`/root-admin/sales`} className="category-card">
          <h2>Sales</h2>
          <p>View sales reports</p>
        </Link>
      </div>
    </div>
    </center>
    </div>
    </>
  );
}

export default AdminDashboard;
