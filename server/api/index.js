const express = require('express')
const app = express()
const volleyball = require('volleyball')
const path = require('path')

module.exports = app

app.use(volleyball)
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')))

app.get('/', (req, res) => res.send('hello'))
