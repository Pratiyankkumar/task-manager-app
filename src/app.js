const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/tasks.js')
const auth = require('./middleware/auth.js')
const path = require('path')

const app = express();

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const publicDirectoryPath = path.join(__dirname, '../public')
console.log(publicDirectoryPath)

app.use(express.static(publicDirectoryPath))

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: publicDirectoryPath })
})

app.get('', (req, res) => {
  res.sendFile('signup.html', { root: publicDirectoryPath })
})

app.get('/home', (req, res) => {
  res.sendFile('home.html', {root: publicDirectoryPath})
})

app.get('/user', (req, res) => {
  res.sendFile('profile.html', {root: publicDirectoryPath})
})

app.get('/update', (req, res) => {
  res.sendFile('update.html', {root: publicDirectoryPath})
})

module.exports = app
