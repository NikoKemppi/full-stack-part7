const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (password === undefined) {
    return response.status(400).json({ error: "The password doesn't exist" })
  } else if (password.length < 3) {
    return response.status(400).json({ error: "The password is too short" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = usersRouter