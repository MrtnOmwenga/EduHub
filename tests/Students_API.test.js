const supertest = require('supertest');
const mongoose = require('mongoose');
const { students } = require('./Students.json');
const Students = require('../models/students');
const Courses = require('../models/courses');
const app = require('../App');

const api = supertest(app);

beforeEach(async () => {
  await Students.deleteMany({});

  const IterStudents = students.map(async (student) => {
    const IterCourses = student.courses.map(async (course) => {
      const CourseObject = await Courses.find({ name: course.name });
      return {
        ...course,
        id: CourseObject[0]?._id,
      };
    });
    const result = await Promise.all(IterCourses);
    return {
      ...student,
      courses: result,
    };
  });
  const UpdatedStudents = await Promise.all(IterStudents);

  // console.log(UpdatedStudents.map((_) => _.courses));
  const PromiseArray = UpdatedStudents
    .map((StudentObject) => new Students(StudentObject))
    .map((StudentModel) => StudentModel.save());

  await Promise.all(PromiseArray);
}, 1000000);

describe('Check that database is fully initialized', () => {
  test('All Objects have been added to database', async () => {
    const StudentsInDB = await Students.find({});

    expect(StudentsInDB).toHaveLength(students.length);
  });
});

describe('Test get url', () => {
  test('API returns all objects from db in json format', async () => {
    const response = await api
      .get('/api/students')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(students.length);
  });

  test('API returns correct user when valid id is passed', async () => {
    const StudentsInDB = await Students.find({});
    const StudentToCheck = StudentsInDB[0];
    const response = await api
      .get(`/api/students/${StudentToCheck._id}`)
      .expect(200);

    expect(response.body.name).toContain(StudentToCheck.name);
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
      .post('/api/students')
      .send(ValidUser)
      .expect(201);

    expect(response.body.name).toContain(ValidUser.name);
  });

  test('Non-unique email gets rejected', async () => {
    const DuplicateUser = {
      name: 'Duplicate User',
      email: 'adalovelace@gmail.com',
      password: 'foobar',
    };

    const response = await api
      .post('/api/students')
      .send(DuplicateUser)
      .expect(500);

    console.log(response);
  });
});

describe('Test put url', () => {
  test('Valid id and object gets updated', async () => {
    const StudentsInDB = await Students.find({});
    const UpdatedUser = {
      name: 'UpdatedUser',
      email: 'updateduser@gmail.com',
      password: 'foobar',
    };

    const response = await api
      .put(`/api/students/${StudentsInDB[0]._id}`)
      .send(UpdatedUser)
      .expect(200);

    expect(response.body.name).toContain(StudentsInDB[0].name);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
