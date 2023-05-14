const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      password: 'salainen',
      name: 'Matti Luukkainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContainEqual(newUser.username)
  })

  test('creation does not succeed with missing or too short username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      password: 'somethingUnique',
      name: 'Jussi Loukko',
    }
    const newUser2 = {
      username: 'z',
      password: 'shasha',
      name: 'Shark Shoes',
    }

    const response1 = await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)

    expect(response1.body).toEqual({error: "User validation failed: username: Path `username` is required."})

    const response2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)

    expect(response2.body).toEqual({error: "User validation failed: username: Path `username` (`z`) is shorter than the minimum allowed length (3)."})

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation does not succeed with missing or too short password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      username: 'jussi',
      name: 'Jussi Loukko',
    }
    const newUser2 = {
      username: 'ShaShaSha',
      password: 'z',
      name: 'Shark Shoes',
    }

    const response1 = await api
      .post('/api/users')
      .send(newUser1)
      .expect(400)

    expect(response1.body).toEqual({ error: "The password doesn't exist" })

    const response2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)

    expect(response2.body).toEqual({ error: "The password is too short" })

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation does not succeed with an already existing username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      password: 'secret',
      name: 'Ruutti Sekretti',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})