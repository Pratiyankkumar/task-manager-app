const express = require('express')
const router = express.Router();
const Task = require('../models/task.js')
const auth = require('../middleware/auth.js')

// R => read
// GET /tasks?completed=false or /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks/sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    })
    res.send(req.user.tasks)
  } catch (error) {
    res.status(500).send(error)
  }
})

// R => read
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    })
    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (error) {
    res.status(500).send('An error occured')
  }
})



// U => Update
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid Update'})
  }

  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }

    // const task = await Task.findById(req.params.id);

    updates.forEach((update) => {
      task[update] = req.body[update]
    })

    await task.save();
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})



// delete
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).send('404 not found!')
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})



//C  => Create
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    const result = await task.save()
    res.status(201).send(result)
  } catch (error) {
    res.status(500).send(error)
  }
  
})

module.exports = router;