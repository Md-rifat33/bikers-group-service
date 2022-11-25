const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000

// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(`How are you. You will be die soon`)
})

app.listen(port, () => {
  console.log('hello world')
})
