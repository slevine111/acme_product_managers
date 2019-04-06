import React from 'react'
import { Link } from 'react-router-dom'

const createLink = (route, htmlString) => {
  return (
    <Link key={route} to={route} className="nav-item nav-link">
      {htmlString}
    </Link>
  )
}

const Navbar = () => {
  const arrayOfLinks = [
    { route: '/', htmlString: 'Home' },
    { route: '/products', htmlString: 'Products' },
    { route: '/managers', htmlString: 'Managers' }
  ]
  return (
    <ul className="nav nav-tabs">
      {arrayOfLinks.map(link => createLink(link.route, link.htmlString))}
    </ul>
  )
}

export default Navbar
