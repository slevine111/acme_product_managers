const { Product, Manager, setAssociations } = require('./models/index')
const connection = require('./connection')

const dbIniit = () => {
  return connection
    .authenticate()
    .then(() => setAssociations())
    .then(() => connection.sync({ force: true }))
}

const createSeedInstances = (model, instances) => {
  return Promise.all(instances.map(instance => model.create(instance)))
}

const syncAndSeed = () => {
  return dbIniit()
    .then(() => {
      return Promise.all([
        createSeedInstances(Product, [
          { name: 'foo' },
          { name: 'bazz' },
          { name: 'bar' }
        ]),
        createSeedInstances(Manager, [
          { name: 'Larry' },
          { name: 'Moe' },
          { name: 'Curly' }
        ])
      ])
    })
    .then(([products, managers]) => {
      const [foo, bazz, bar] = products
      const [larry, moe, curly] = managers
      return Promise.all([
        larry.setProducts([foo, bar]),
        curly.setProducts(bazz)
      ])
    })
    .then(() => console.log('database successfully synced and seeded'))
}

module.exports = { syncAndSeed, Product, Manager }
