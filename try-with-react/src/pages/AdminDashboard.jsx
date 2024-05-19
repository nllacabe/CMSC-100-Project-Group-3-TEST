import React from 'react';
import { Link } from 'react-router-dom';
import usersImage from '../assets/users.png';
import listingsImage from '../assets/listings.png';
import fulfillmentImage from '../assets/fulfillment.png';
import salesImage from '../assets/sales.png';

function AdminDashboard() {
  return (
    <>
      <header className='admin-header'> Welcome back, Admin! </header>
      <div className='admin-dashboard-container'>
        <center>
          <div className="admin-dashboard">
            <div className="category-cards">
              {/* card for Users */}
              <Link to={`/root-admin/users`} className="category-card admin-link">
                <h2>User accounts</h2>
                <img src={usersImage} alt="Users" className="category-image"/>
                <p>Manage user accounts</p>
              </Link>

              {/* card for Listings */}
              <Link to={`/root-admin/listings`} className="category-card admin-link">
                <h2>Listings</h2>
                <img src={listingsImage} alt="Listings" className="category-image"/>
                <p>Manage product listings</p>
              </Link>

              {/* card for Fulfillment */}
              <Link to={`/root-admin/fulfillment`} className="category-card admin-link">
                <h2>Fulfillment</h2>
                <img src={fulfillmentImage} alt="Fulfillment" className="category-image"/>
                <p>Process and fulfill orders</p>
              </Link>

              {/* card for Sales */}
              <Link to={`/root-admin/sales`} className="category-card admin-link">
                <h2>Sales</h2>
                <img src={salesImage} alt="Sales" className="category-image"/>
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
