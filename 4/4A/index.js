const express = require('express')
const { Sequelize } = require('sequelize');
const config = require('./config/config.json')
const sequelize = new Sequelize(config.development)
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})