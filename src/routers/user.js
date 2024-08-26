const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js')
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account.js')
const sharp = require('sharp')
const User = require('../models/user.js')

router.use(express.json())
//Create
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    const result = await user.save()
    const token = await  user.generateAuthToken()
    res.status(201).send({result, token})
    // sendWelcomeEmail(user.email, user.name)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken()
    res.send({user: user.getPublicProfile(), token})
  } catch (error) {
    res.status(400).send({error: 'Unable to login'})
  } 
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()

    res.send()
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/users/logoutAll',auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send({error: 'Unable to log out'})
  }
})

// Accesing users fro the database here we have used aync await you can use promises (.then()) also
// R => read
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user.getPublicProfile())
})


// U => Update
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']

   const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
   })

   if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid Update'})
   }

  try {
    // for running middleware
    const user = await User.findById(req.user._id)
    updates.forEach((update) => {
      user[update] = req.body[update]
    })

    await user.save()

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    res.send(user.getPublicProfile())
  } catch (error) {
    res.status(400).send(error)
  }
})

// D => delete
router.delete('/users/me', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({_id: req.user._id})
    res.send({user: user.getPublicProfile()})
    // sendCancelationEmail(user.email, user.name)
  } catch (error) {
    res.status(500).send({error: 'Unable to delete'})
  }
})

const upload = multer({
  limits: {
    fileSize: 2000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('File type must be jpg, jpeg, png'))
    }

    cb(undefined, true)
  }
})

// Upload user avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send('File uploaded to server')
}, (error, req, res, next) => { //Error handling
  res.status(400).send({error: error.message})
})

// Delete user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send('Profile picture Deleted')
  } catch (error) {
    res.status(500).send({error})
  }
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
})

module.exports = router