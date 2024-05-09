import { Outlet, Link } from 'react-router-dom';

export default function Root() {

    return (
      <>
      <nav>
        <ul>
            <li><Link to={`/`}>Shop</Link></li>
            <li><Link to={`/orders`}>Orders</Link></li>
        </ul>
      </nav>
      <Outlet />        {/* taas yung navbar, baba yung mga anak */}
    </>
    )
  }