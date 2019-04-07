import React from 'react'
import { Link } from 'react-router-dom'

const createLink = (route, htmlString, pathname) => {
  return (
    <Link
      key={route}
      to={route}
      className={`nav-item nav-link ${pathname === route ? 'active' : ''}`}
    >
      {htmlString}
    </Link>
  )
}

const Navbar = ({ location }) => {
  const { pathname } = location
  const arrayOfLinks = [
    { route: '/', htmlString: 'Home' },
    { route: '/products', htmlString: 'Products' },
    { route: '/managers', htmlString: 'Managers' }
  ]
  return (
    <ul className="nav nav-tabs">
      {arrayOfLinks.map(link =>
        createLink(link.route, link.htmlString, pathname)
      )}
    </ul>
  )
}

export default Navbar
