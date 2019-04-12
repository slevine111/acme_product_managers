import {
  getManagersWithProducts,
  managerOpenings
} from '../client/helperfunctions'

describe('Helper functions on state of Redux store', () => {
  test('getManagersWithProducts function returns managers currently associated to a product', () => {
    const input = {
      managers: [{ id: 1, name: 'larry' }, { id: 2, name: 'moe' }],
      products: [
        { id: 1, name: 'foo', managerId: 2 },
        { id: 2, name: 'bar', managerId: 2 }
      ]
    }
    expect(getManagersWithProducts(input)).toEqual([{ id: 2, name: 'moe' }])
    input.products = input.products.map((p, idx) =>
      idx === 0 ? { ...p, managerId: 1 } : p
    )
    expect(getManagersWithProducts(input)).toEqual(input.managers)
  })
  test('managerOpenings returns true if any products have NULL managerIds and false otherwise', () => {
    const input = {
      managers: [{ id: 1, name: 'larry' }, { id: 2, name: 'moe' }],
      products: [
        { id: 1, name: 'foo', managerId: 2 },
        { id: 2, name: 'bar', managerId: 2 }
      ]
    }
    expect(managerOpenings(input)).toBe(false)
    input.products = input.products.map((p, idx) =>
      idx === 0 ? { ...p, managerId: null } : p
    )
    expect(managerOpenings(input)).toBe(true)
  })
})
