import { Outlet, Link } from 'react-router-dom';

export default function Root() {
 //add handle signout
    return (
      <>
      <header>
        <section className="navbar-content">
          <h1>Farm-To-Table</h1>
          <nav>
            <ul className="navbar-links">
                <li><Link to={`shop`}>SHOP</Link></li>
                <li><Link to={`/orders`}>ORDERS</Link></li>
            </ul>
          </nav>
        </section>
      </header>
      <Outlet />        {/* taas yung navbar, baba yung mga anak */}
    </>
    )
  }