
import { Outlet, Link } from 'react-router-dom';

export default function Root() {

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
            </ul>
          </nav>
        </section>
      </header>
      <Outlet />        {/* taas yung navbar, baba yung mga anak */}
    </>
    )
  }
