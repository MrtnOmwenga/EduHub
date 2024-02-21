const InstructorRoutes = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Instructors = require('../models/instructors.model');
const { validateInstructorCreation, validateInstructorUpdate, validateInstructorGet } = require('../services/instructor-validator.service');
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

  // Validate the ID for both format and existence
  const validation = await validateInstructorGet(request.params.id);
  if (!validation.isValid) {
    return response.status(400).send(validation.message);
  }

  const instructors = await Instructors.findById(request.params.id);
  return response.json(instructors);
});

InstructorRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const { error } = await validateInstructorCreation({ name, email, password });
  if (error) {
    return response.status(400).send(error.details[0].message);
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
    .status(201)
    .json({ token, name: result.name, id: result.id });
});

InstructorRoutes.put('/:id', async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const { error } = await validateInstructorUpdate(request.params.id, request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  const result = await Instructors.findByIdAndUpdate(request.params.id, request.body, { new: true });
  return response.status(200).json(result);
});

module.exports = InstructorRoutes;
