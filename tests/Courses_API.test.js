const supertest = require('supertest');
const mongoose = require('mongoose');
const { courses } = require('./Courses.json');
const Courses = require('../models/courses');
const app = require('../App');

const api = supertest(app);

beforeEach(async () => {
  await Courses.deleteMany({});

  const PromiseArray = courses
    .map((CourseObject) => new Courses(CourseObject))
    .map((CourseModel) => CourseModel.save());

  await Promise.all(PromiseArray);
}, 100000);

describe('Check that database is fully initialized', () => {
  test('All Objects have been added to database', async () => {
    const CoursesInDB = await Courses.find({});

    expect(CoursesInDB).toHaveLength(courses.length);
  });
});

describe('Test get url', () => {
  test('API returns all objects from db in json format', async () => {
    const response = await api
      .get('/api/courses')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(courses.length);
  });
});

describe('Test post url', () => {
  test('Valid user object gets added to database', async () => {
    const ValidCourse = {
      name: 'Valid Course',
      instructor: 'Valid Instructor',
    };

    const response = await api
      .post('/api/courses')
      .send(ValidCourse)
      .expect(201);

    expect(response.body.name).toContain(ValidCourse.name);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
