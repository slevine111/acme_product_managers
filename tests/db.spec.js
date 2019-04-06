const { syncAndSeed, Product, Manager } = require('../server/db/index')
const sequelizeValidationError = require('sequelize').ValidationError

describe('Database models', () => {
  beforeAll(() => {
    return syncAndSeed()
  })

  describe('Manager model', () => {
    test('it has a name field', () => {
      return Manager.findByPk(1).then(manager =>
        expect(manager.name).toBeDefined()
      )
    })

    test('the name field is required', () => {
      let error
      return Manager.create({})
        .then(() => {
          error = new Error('noo')
        })
        .catch(err => {
          error = err
        })
        .then(() => {
          expect(error.message).toBe(
            'notNull Violation: name field is required'
          )
          expect(error).toBeInstanceOf(sequelizeValidationError)
        })
    })
  })
  describe('Product model', () => {
    test('it has a name field', () => {
      return Product.findByPk(1).then(p => expect(p.name).toBeDefined())
    })

    test('the name field is required', () => {
      let error
      return Product.create({})
        .then(() => {
          error = new Error('noo')
        })
        .catch(err => {
          error = err
        })
        .then(() => {
          expect(error.message).toBe(
            'notNull Violation: name field is required'
          )
          expect(error).toBeInstanceOf(sequelizeValidationError)
        })
    })
    test('it has a foreign key to the Manager model', () => {
      return Promise.all([
        Product.findOne({ where: { name: 'bazz' } }),
        Manager.findOne({ where: { name: 'Curly' } })
      ]).then(([bazz, curly]) => expect(bazz.managerId).toBe(curly.id))
    })
  })
})
