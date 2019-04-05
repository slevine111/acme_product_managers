const Sequelize = require('sequelize')

const connection = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_product_managers'
)

module.exports = connection
