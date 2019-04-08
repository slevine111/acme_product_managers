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

const Navbar = ({ location, numberOfManagersWithProducts }) => {
  const { pathname } = location
  const arrayOfLinks = [
    { route: '/', htmlString: 'Home' },
    { route: '/products', htmlString: 'Products' },
    {
      route: '/managers',
      htmlString: `Managers (${numberOfManagersWithProducts})`
    }
  ]
  return (
    <ul className="nav nav-pills">
      {arrayOfLinks.map(link =>
        createLink(link.route, link.htmlString, pathname)
      )}
    </ul>
  )
}

export default Navbar
