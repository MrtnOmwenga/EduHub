const CoursesRoutes = require('express').Router();
const Courses = require('../models/courses.model');
const { validateCourseCreation, validateCourseUpdate, validateCourseDeletion, validateCourseGet } = require('../services/course-validator.service');
require('express-async-errors');

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

CoursesRoutes.post('/', async (request, response) => {
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

  const CourseModel = new Courses(NewCourseObject);
  const result = await CourseModel.save();

  return response.status(201).json(result);
});

// PUT (Update) an existing course
CoursesRoutes.put('/:id', async (request, response) => {
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

  const result = await Courses.findByIdAndUpdate(courseId, updatedCourseData, {
    new: true, // Return the updated document
  });

  return response.status(200).json(result);
});

// DELETE a course by ID
CoursesRoutes.delete('/:id', async (request, response) => {
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
