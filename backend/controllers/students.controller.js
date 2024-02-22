const StudentRoutes = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csrf = require('csurf');
const Students = require('../models/students.model');
const { validateStudentCreation, validateStudentUpdate, validateStudentGet } = require('../services/students-validator.service');
require('express-async-errors');

const csrfProtection = csrf({ cookie: true });

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

StudentRoutes.post('/', csrfProtection, async (request, response) => {
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

StudentRoutes.put('/:id', csrfProtection, async (request, response) => {
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

StudentRoutes.delete('/:id', csrfProtection, async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const studentId = request.params.id;

  // Validate the ID for both format and existence
  const validation = await validateStudentGet(studentId);
  if (!validation.isValid) {
    return response.status(400).send(validation.message);
  }

  try {
    // Find and delete the student
    await Students.findByIdAndDelete(studentId);
    return response.status(204).send(); // No content
  } catch (error) {
    return response.status(500).send('Internal Server Error');
  }
});

module.exports = StudentRoutes;
