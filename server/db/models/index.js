const Sequelize = require('sequelize')
const connection = require('../connection')

const Product = connection.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'name field is required'
      }
    }
  }
})

const Manager = connection.define('manager', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'name field is required'
      }
    }
  }
})

const setAssociations = () => {
  return Promise.all([Product.belongsTo(Manager), Manager.hasMany(Product)])
}

module.exports = { Product, Manager, setAssociations }
