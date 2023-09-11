const CoursesRoutes = require('express').Router();
const Courses = require('../models/courses');
require('express-async-errors');

CoursesRoutes.get('/', async (request, response) => {
  const courses = await Courses.find({});
  response.json(courses);
});

CoursesRoutes.get('/:id', async (request, response) => {
  const courses = await Courses.findById(request.params.id);
  response.json(courses);
});

CoursesRoutes.post('/', async (request, response) => {
  const NewCourseObject = request.body;

  const CourseModel = new Courses(NewCourseObject);
  const result = await CourseModel.save();

  return response.status(201).json(result);
});

module.exports = CoursesRoutes;
