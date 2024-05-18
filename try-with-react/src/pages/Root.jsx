import { Outlet, Link } from 'react-router-dom';
import logo from '../images/logo.png';

export default function Root() {

    return (
      <>
      <header>
        <section className="navbar-container">
          <div className="logo-container">
            <img src={logo} className="logo-img"/>
            <p className="logo-title">Farm-To-Table</p>
          </div>
          <nav>
            <ul className="navbar-links">
                <li><Link to={`/`} className="navbar-link">Shop</Link></li>
                <li><Link to={`/orders`} className="navbar-link">Your Orders</Link></li>
            </ul>
          </nav>
        </section>
      </header>
      <Outlet />
    </>
    )
  }