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

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create and save the new instructor object
    const result = await Instructors.create({
      name,
      email,
      password: passwordHash,
    });

    const forToken = {
      name: result.name,
      id: result.id,
    };
    const token = jwt.sign(forToken, process.env.SECRET);
  
    return response
      .status(201)
      .json({ token, name: result.name, id: result.id });

    return response.status(201).json(result);
  } catch (error) {
    return response.status(500).send('Error creating instructor');
  }
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

  try {
    const instructorId = request.params.id;
    const updatedInstructorData = request.body;

    // Update the instructor using findOneAndUpdate
    const result = await Instructors.findOneAndUpdate(
      { _id: instructorId },
      updatedInstructorData,
      { new: true }
    );

    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).send('Error updating instructor');
  }
});

module.exports = InstructorRoutes;
