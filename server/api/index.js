const express = require('express')
const app = express()
const volleyball = require('volleyball')
const path = require('path')
const { Product, Manager } = require('../db/index')

module.exports = app

app.use(volleyball)
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'))
})

app.get('/api/managers', (req, res, next) => {
  Manager.findAll({ order: ['name'] })
    .then(managers => res.json(managers))
    .catch(next)
})

app.get('/api/products', (req, res, next) => {
  Product.findAll({ order: ['id'] })
    .then(products => res.json(products))
    .catch(next)
})

app.put('/api/products/:id', (req, res, next) => {
  Product.findByPk(Number(req.params.id))
    .then(product => product.update(req.body))
    .then(changedProduct => res.json(changedProduct))
    .catch(next)
})

app.use((req, res) => res.status(404).send('Resource not found'))

app.use((err, req, res, next) => {
  let errorToSend
  if (Array.isArray(err.errors)) {
    errorToSend = err.errors.map(error => error.message)
  } else {
    console.log('here')
    errorToSend = 'Internal Server Error'
  }
  res.status(err.status || 500).send(errorToSend)
})
