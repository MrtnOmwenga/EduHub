const InstructorRoutes = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Instructors = require('../models/instructors');
require('express-async-errors');

InstructorRoutes.get('/', async (request, response) => {
  const auth = request.token;

  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const instructors = await Instructors.find({});
  return response.json(instructors);
});

InstructorRoutes.get('/:id', async (request, response) => {
  const auth = request.token;

  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const instructors = await Instructors.findById(request.params.id);
  return response.json(instructors);
});

InstructorRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(400).send('Invalid username, email or password');
  }

  if (password.length < 3) {
    return response.status(400).send('Password must be at least three characters');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const NewInstructor = new Instructors({
    name,
    email,
    password: passwordHash,
  });

  const result = await NewInstructor.save();

  const forToken = {
    name: result.name,
    id: result.id,
  };
  const token = jwt.sign(forToken, process.env.SECRET);

  return response
    .status(200)
    .json({ token, name: result.name, id: result.id });
});

InstructorRoutes.put('/:id', async (request, response) => {
  const auth = request.token;

  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const result = await Instructors.findByIdAndUpdate(request.params.id, request.body);
  return response.status(200).json(result);
});

module.exports = InstructorRoutes;
