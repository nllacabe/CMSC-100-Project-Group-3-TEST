import { Outlet, Link } from 'react-router-dom';

export default function Root() {

    return (
      <>
      <header>
        <section className="navbar-content">
          <h1>Farm-To-Table-Admin</h1>
          <nav>
            <ul className="navbar-links">
                <li><Link to={`/root-admin/users`}>USERS</Link></li>
                <li><Link to={`/root-admin/listings`}>LISTINGS</Link></li>
                <li><Link to={`/root-admin/fulfillment`}>FULFILLMENT</Link></li>
                <li><Link to={`/root-admin/sales`}>SALES</Link></li>
            </ul>
          </nav>
        </section>
      </header>
      <Outlet />        {/* taas yung navbar, baba yung mga anak */}
    </>
    )
  }