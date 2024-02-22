const CoursesRoutes = require('express').Router();
const csrf = require('csurf');
const Courses = require('../models/courses.model');
const { validateCourseCreation, validateCourseUpdate, validateCourseDeletion, validateCourseGet } = require('../services/course-validator.service');
require('express-async-errors');

const csrfProtection = csrf({ cookie: true });

CoursesRoutes.get('/', async (request, response) => {
  const courses = await Courses.find({});
  response.json(courses);
});

CoursesRoutes.get('/:id', async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  // Validate the ID for both format and existence
  const validation = validateCourseGet(request.params.id);
  if (!validation.isValid) {
    return response.status(400).send(validation.message);
  }

  const courses = await Courses.findById(request.params.id);
  response.json(courses);
});

CoursesRoutes.post('/', csrfProtection, async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  // Validate the data
  const NewCourseObject = request.body;
  const { error } = await validateCourseCreation(NewCourseObject);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  try {
    const result = await Courses.create(NewCourseObject);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(500).send('Error creating course');
  }
});

// PUT (Update) an existing course
CoursesRoutes.put('/:id', csrfProtection, async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const courseId = request.params.id;
  const updatedCourseData = request.body;
  // Validate the data
  const { error } = await validateCourseUpdate(courseId, updatedCourseData);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  try {
    // Update the course and return the updated data
    const result = await Courses.findByIdAndUpdate(courseId, updatedCourseData, {
      new: true, // Return the updated document
    });

    if (!result) {
      return response.status(404).send('Course not found');
    }

    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).send('Error updating course');
  }
});

// DELETE a course by ID
CoursesRoutes.delete('/:id', csrfProtection, async (request, response) => {
  const auth = request.token;
  if (!auth) {
    return response.status(400).send('Invalid Token');
  }

  const courseId = request.params.id;
  // Validate the ID
  const { error } = await validateCourseDeletion(courseId);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  // Delete the course
  await Courses.findByIdAndDelete(courseId);

  return response.status(204).send(); // No content
});

module.exports = CoursesRoutes;
