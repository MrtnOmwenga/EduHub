const StudentRoutes = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Students = require('../models/students');
require('express-async-errors');

StudentRoutes.get('/', async (request, response) => {
  const students = await Students.find({});
  response.json(students);
});

StudentRoutes.get('/:id', async (request, response) => {
  const students = await Students.findById(request.params.id);
  response.json(students);
});

StudentRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(400).send({ error: 'Bad Request' });
  }

  if (password.length < 3) {
    return response.status(400).send({ error: 'Password too short' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const NewStudent = new Students({
    name,
    email,
    password: passwordHash,
  });

  const result = await NewStudent.save();

  const forToken = {
    name: result.name,
    id: result.id,
  };
  const token = jwt.sign(forToken, process.env.SECRET);

  return response
    .status(200)
    .json({ token, name: result.name, id: result.id });
});

StudentRoutes.put('/:id', async (request, response) => {
  const result = await Students.findByIdAndUpdate(request.params.id, request.body);
  return response.status(200).json(result);
});

module.exports = StudentRoutes;
