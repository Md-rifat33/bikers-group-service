const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const { query } = require('express')
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
    const usersCollection = client.db('bikeResale').collection('users')
    const reviewsCollection = client.db('bikeResale').collection('reviews')
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

    app.get('/bookings', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const bookings = await bookingsCollection.find(query).toArray()
      res.send(bookings)
    })

    app.post('/bookings', async (req, res) => {
      const booking = req.body
      const result = await bookingsCollection.insertOne(booking)
      res.send(result)
    })

    app.get('/reviews', async (req, res) => {
      const query = {}
      const cursor = await reviewsCollection.find(query).toArray()
      res.send(cursor)
    })

    app.get('/users', async (req, res) => {
      const query = {}
      const users = await usersCollection.find(query).toArray()
      res.send(users)
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })
    app.put('/users/admin/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          role: 'admin',
        },
      }
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      )
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
