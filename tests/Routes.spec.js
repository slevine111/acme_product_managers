const app = require('supertest')(require('../server/api/index'))
const { syncAndSeed, Product, Manager } = require('../server/db/index')

describe('Routes', () => {
  beforeAll(() => {
    return syncAndSeed()
  })

  describe('GET / route', () => {
    test('it returns a HTML file', done => {
      app
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/html/, done)
    })
  })

  describe('GET /api/managers route', () => {
    test('it returns a JSON object', done => {
      app
        .get('/api/managers')
        .expect(200)
        .expect('Content-Type', /application\/json/, done)
    })
    test('it returns all managers in the database', done => {
      app
        .get('/api/managers')
        .then(({ body }) => {
          return Promise.all([body, Manager.findAll()])
        })
        .then(([apiResult, dbResult]) => {
          expect(apiResult.length).toBe(dbResult.length)
          done()
        })
        .catch(done)
    })
  })

  describe('GET /api/products route', () => {
    test('it returns a JSON object', done => {
      app
        .get('/api/products')
        .expect(200)
        .expect('Content-Type', /application\/json/, done)
    })
    test('it returns all managers in the database', done => {
      app
        .get('/api/products')
        .then(({ body }) => {
          return Promise.all([body, Product.findAll()])
        })
        .then(([apiResult, dbResult]) => {
          expect(apiResult.length).toBe(dbResult.length)
          done()
        })
        .catch(done)
    })
  })

  describe('PUT /api/products/:id route', () => {
    let productChanging
    beforeAll(() => {
      return Product.findByPk(1).then(product => {
        productChanging = product
      })
    })

    test('it returns a JSON object', done => {
      app
        .put('/api/products/1')
        .send({ name: productChanging.name, managerId: 1 })
        .expect(200)
        .expect('Content-Type', /application\/json/, done)
    })
    test('it changes the managerId of the product to another manager', done => {
      const { name, managerId } = productChanging
      app
        .put('/api/products/1')
        .send({
          name,
          managerId: managerId === 1 ? 2 : managerId === 2 ? 3 : 1
        })

        .then(({ body }) => {
          return Promise.all([body, Product.findByPk(1)])
        })
        .then(([apiResult, dbResult]) => {
          expect(apiResult.length).toBe(dbResult.length)
          expect(apiResult.name).toBe(dbResult.name)
          expect(apiResult.managerId).toBe(dbResult.managerId)
          expect(apiResult.managerId).not.toBe(managerId)
          done()
        })
        .catch(done)
    })
    test('it can change the managerId of the product to null', done => {
      const { name, managerId } = productChanging
      app
        .put('/api/products/1')
        .send({
          name,
          managerId: null
        })

        .then(({ body }) => {
          return Promise.all([body, Product.findByPk(1)])
        })
        .then(([apiResult, dbResult]) => {
          expect(apiResult.length).toBe(dbResult.length)
          expect(apiResult.name).toBe(dbResult.name)
          expect(apiResult.managerId).toBe(dbResult.managerId)
          expect(apiResult.managerId).toBeNull
          done()
        })
        .catch(done)
    })
    test('changing the ManagerId to non-integer or id not available results in an error and a 500 status', done => {
      const { name, managerId } = productChanging
      app
        .put('/api/products/1')
        .send({
          name,
          managerId: 7
        })
        .expect(500)
        .end((err, response) => {
          expect(response.body).toEqual({})
          expect(response.text).not.toBe('')
          if (err) done(err)
          return done()
        })
    })
  })

  describe('Any other route', () => {
    test("it retuns a 404 status code with message of 'Resource Not Found", done => {
      app
        .get('/badRoute')
        .expect(404)
        .end((err, response) => {
          if (err) done(err)
          expect(response.text).toMatch(/Resource not found/)
          done()
        })
    })
  })
})
