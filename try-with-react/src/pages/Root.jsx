// Root.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from "../authentication/AuthenticationProv";

export default function Root() {
  const { logout } = useAuth();

  const Logout = () => {
    logout();
  };

  return (
    <>
      <header>
        <section className="navbar-content">
          <h1>Farm-To-Table</h1>
          <nav>
            <ul className="navbar-links">
              <li><Link to={`/root/shop`}>SHOP</Link></li>
              <li><Link to={`/root/orders`}>ORDERS</Link></li>
              <li><Link to={`/root/profile`}>PROFILE</Link></li>
              <li><button onClick={Logout}>Sign Out</button></li>
            </ul>
          </nav>
        </section>
      </header>
      <Outlet />        {/* taas yung navbar, baba yung mga anak */}
    </>
  );
}
