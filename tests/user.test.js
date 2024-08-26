const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app.js')
const User = require('../src/models/user.js')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '56what!!',
  tokens: [{
    token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
  }]
}

beforeEach(async () => {
  await User.deleteMany()
  await new User(userOne).save()
})

// afterEach(() => {
//   console.log('afterEach')
// })

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Pratiyank',
    email: 'pratiyank49@gmail.com',
    password: 'MyPass777!'
  }).expect(201)

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.result._id)
  expect(user).not.toBeNull()

  // Assertion about the response
  // expect(response.body.result.name).toBe('Pratiyank')
  expect(response.body).toMatchObject({
    result: {
      name: 'Pratiyank',
      email: 'pratiyank49@gmail.com'
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('Mypass777!')
})


test('should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
  
  const user = await User.findById(response.body.user._id)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'pal1234@'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for unauthentiated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete account for user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(response.body.user)
    expect(user).toBeNull()
})

test('should not delete account for unautheticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})