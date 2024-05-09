import { Outlet, Link } from 'react-router-dom';

export default function Root() {

    return (
      <>
      <header>
        <section className="navbar-content">
          <h1>Farm-To-Table</h1>
          <nav>
            <ul className="navbar-links">
                <li><Link to={`/`}>SHOP</Link></li>
                <li><Link to={`/orders`}>ORDERS</Link></li>
            </ul>
          </nav>
        </section>
      </header>
      <Outlet />        {/* taas yung navbar, baba yung mga anak */}
    </>
    )
  }