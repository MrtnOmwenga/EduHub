const supertest = require('supertest');
const mongoose = require('mongoose');
const { instructors } = require('./Instructors.json');
const Instructors = require('../models/instructors');
const Courses = require('../models/courses');
const app = require('../App');

const api = supertest(app);

beforeEach(async () => {
  await Instructors.deleteMany({});

  const IterInstructors = instructors.map(async (instructor) => {
    const IterCourses = instructor.courses.map(async (course) => {
      const CourseObject = await Courses.find({ name: course.name });
      return {
        ...course,
        id: CourseObject[0]?._id,
      };
    });
    const result = await Promise.all(IterCourses);
    return {
      ...instructor,
      courses: result,
    };
  });
  const UpdatedInstructors = await Promise.all(IterInstructors);

  const PromiseArray = UpdatedInstructors
    .map((InstructorObject) => new Instructors(InstructorObject))
    .map((InstructorModel) => InstructorModel.save());

  await Promise.all(PromiseArray);
}, 100000);

describe('Check that database is fully initialized', () => {
  test('All Objects have been added to database', async () => {
    const InstructorsInDB = await Instructors.find({});

    expect(InstructorsInDB).toHaveLength(instructors.length);
  });
});

describe('Test get url', () => {
  test('API returns all objects from db in json format', async () => {
    const response = await api
      .get('/api/instructors')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(instructors.length);
  });

  test('API returns correct user when valid id is passed', async () => {
    const InstructorsInDB = await Instructors.find({});
    const InstructorToCheck = InstructorsInDB[0];
    const response = await api
      .get(`/api/instructors/${InstructorToCheck._id}`)
      .expect(200);

    expect(response.body.name).toContain(InstructorToCheck.name);
  });
});

describe('Test post url', () => {
  test('Valid user object gets added to database', async () => {
    const ValidUser = {
      name: 'ValidUser',
      email: 'validuser@gmail.com',
      password: 'foobar',
    };

    const response = await api
      .post('/api/instructors')
      .send(ValidUser)
      .expect(201);

    expect(response.body.name).toContain(ValidUser.name);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
