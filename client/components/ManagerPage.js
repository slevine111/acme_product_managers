import React from 'react'

const ManagersPage = ({ managersWithProducts }) => {
  return (
    <ul>
      {managersWithProducts.map(manager => (
        <li key={manager.id}>{manager.name}</li>
      ))}
    </ul>
  )
}

export default ManagersPage
