export const getManagersWithProducts = ({ products, managers }) => {
  const idsOfManagersUsed = products
    .filter(p => p.managerId)
    .map(p => p.managerId)

  return managers.filter(m => idsOfManagersUsed.includes(m.id))
}

export const managerOpenings = ({ products }) => {
  for (let i = 0; i < products.length; ++i) {
    if (!products[i].managerId) return true
  }
  return false
}
