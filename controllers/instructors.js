const InstructorRoutes = require('express').Router();
const bcrypt = require('bcryptjs');
const Instructors = require('../models/instructors');
require('express-async-errors');

InstructorRoutes.get('/', async (request, response) => {
  const instructors = await Instructors.find({});
  response.json(instructors);
});

InstructorRoutes.get('/:id', async (request, response) => {
  const instructors = await Instructors.findById(request.params.id);
  response.json(instructors);
});

InstructorRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(400).send({ error: 'Bad Request' });
  }

  if (password.length < 3) {
    return response.status(400).send({ error: 'Password too short' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const NewInstructor = new Instructors({
    name,
    email,
    password: passwordHash,
  });

  const result = await NewInstructor.save();

  return response.status(201).json(result);
});

module.exports = InstructorRoutes;
