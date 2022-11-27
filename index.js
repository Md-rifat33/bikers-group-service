const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000

// middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dfgrb9f.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const categoriesCollection = client
      .db('bikeResale')
      .collection('categories')
    const bookingsCollection = client.db('bikeResale').collection('bookings')
    app.get('/', async (req, res) => {
      const query = {}
      const cursor = await categoriesCollection.find(query).toArray()
      res.send(cursor)
    })

    app.get('/category/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const category = await categoriesCollection.findOne(query)
      res.send(category)
    })

    app.post('/bookings', async (req, res) => {
      const booking = req.body
      // const query = {
      //   productName: booking.productName,
      //   email: booking.email,
      // }
      // const alreadyBooked = await bookingsCollection.find(query).toArray()

      // if (alreadyBooked.length) {
      //   const message = `${booking.productName} has already been booked`
      //   return res.send({ acknowledged: false, message })
      // }
      const result = await bookingsCollection.insertOne(booking)
      res.send(result)
    })
  } finally {
  }
}

run().catch((err) => {
  console.error(err)
})

app.get('/', (req, res) => {
  res.send(`How are you. You will be die soon`)
})

app.listen(port, () => {
  console.log('hello world')
})
