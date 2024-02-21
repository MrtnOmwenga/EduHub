const StudentRoutes = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Students = require('../models/students.model');
const { validateStudentCreation, validateStudentUpdate, validateStudentGet } = require('../services/students-validator.service');
require('express-async-errors');

StudentRoutes.get('/', async (request, response) => {
  const auth = request.token;

  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const students = await Students.find({});
  return response.json(students);
});

StudentRoutes.get('/:id', async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  // Validate the ID for both format and existence
  const validation = await validateStudentGet(request.params.id);
  if (!validation.isValid) {
    return response.status(400).send(validation.message);
  }

  const students = await Students.findById(request.params.id);
  return response.json(students);
});

StudentRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const { error } = await validateStudentCreation({ name, email, password });
  if (error) {
    return response.status(400).send(error.details[0].message);
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
    .status(201)
    .json({ token, name: result.name, id: result.id });
});

StudentRoutes.put('/:id', async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const { error } = await validateStudentUpdate(request.params.id, request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  const result = await Students.findByIdAndUpdate(request.params.id, request.body, { new: true });
  return response.status(200).json(result);
});

module.exports = StudentRoutes;
