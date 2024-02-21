const supertest = require('supertest');
const mongoose = require('mongoose');
const { courses } = require('./Courses.json');
const Courses = require('../models/courses.model');
const app = require('../App');

const api = supertest(app);

let token;

beforeAll(async () => {
  await Courses.deleteMany({});
  const PromiseArray = courses
    .map((course) => new Courses(course))
    .map((courseModel) => courseModel.save());
  await Promise.all(PromiseArray);

  // Make a request to /services/login to get the token
  const credentials = {
    email: 'artohellas@gmail.com',
    password: 'foobar',
    UserType: 'Instructor',
  };
  const loginResponse = await api
      .post('/services/login')
      .send(credentials)
      .expect(200);

  // Extract the token from the response
  token = loginResponse.body.token;
}, 100000);

describe('Check that database is fully initialized', () => {
  test('All objects have been added to the database', async () => {
    const coursesInDB = await Courses.find({});
    expect(coursesInDB).toHaveLength(courses.length);
  });
});

describe('Test GET endpoint', () => {
  test('API returns all objects from the database in JSON format', async () => {
    const response = await api
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveLength(courses.length);
  });

  test('API returns correct course when a valid ID is passed', async () => {
    const CoursesInDB = await Courses.find({});
    const courseToCheck = CoursesInDB[0];
    const response = await api
      .get(`/api/courses/${courseToCheck._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.name).toBe(courseToCheck.name);
  });

  test('API returns 400 error when an invalid ID is passed', async () => {
    const invalidId = 'invalid-id';
    await api
      .get(`/api/courses/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});

describe('Test POST endpoint', () => {
  test('Valid course object gets added to the database', async () => {
    const validCourse = {
      name: 'New Course',
      instructor: 'New Instructor',
    };
    const response = await api
      .post('/api/courses')
      .send(validCourse)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.name).toBe(validCourse.name);
  });

  test('API returns 400 error when invalid course data is sent', async () => {
    const invalidCourse = {
      instructor: 'New Instructor',
    };
    await api
      .post('/api/courses')
      .send(invalidCourse)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});

describe('Test PUT endpoint', () => {
  test('Valid course object gets updated in the database', async () => {
    const CoursesInDB = await Courses.find({});
    const updatedCourseData = {
      name: 'Updated Course',
      instructor: 'Updated Instructor',
    };
    const courseIdToUpdate = CoursesInDB[0]._id;
    const response = await api
      .put(`/api/courses/${courseIdToUpdate}`)
      .send(updatedCourseData)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.name).toBe(updatedCourseData.name);
  });

  test('API returns 400 error when updating with invalid course data', async () => {
    const CoursesInDB = await Courses.find({});
    const invalidCourseData = {
      instructor: 'Updated Instructor',
    };
    const courseIdToUpdate = CoursesInDB[0]._id;
    await api
      .put(`/api/courses/${courseIdToUpdate}`)
      .send(invalidCourseData)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  test('API returns 400 error when an invalid ID is passed for updating', async () => {
    const invalidId = 'invalid-id';
    await api
      .put(`/api/courses/${invalidId}`)
      .send({ name: 'Updated Course', instructor: 'Updated Instructor' })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});

describe('Test DELETE endpoint', () => {
  test('Course gets deleted from the database', async () => {
    const CoursesInDB = await Courses.find({});
    const courseIdToDelete = CoursesInDB[0].id;
    const response = await api
      .delete(`/api/courses/${courseIdToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  test('API returns 400 error when an invalid ID is passed for deletion', async () => {
    const invalidId = 'invalid-id';
    await api
      .delete(`/api/courses/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
