const supertest = require('supertest');
const mongoose = require('mongoose');
const { students } = require('./Students.json');
const Students = require('../models/students.model');
const Courses = require('../models/courses.model');
const app = require('../App');

const api = supertest(app);

// Global variables.
let token;

beforeAll(async () => {
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

  const PromiseArray = UpdatedStudents
    .map((StudentObject) => new Students(StudentObject))
    .map((StudentModel) => StudentModel.save());

  await Promise.all(PromiseArray);

  // Make a request to /services/login to get the token
  const credentials = {
    email: 'kevincozner@gmail.com',
    password: 'foobar',
    UserType: 'Student',
  };
  const loginResponse = await api
      .post('/services/login')
      .send(credentials)
      .expect(200);

  // Extract the token from the response
  token = loginResponse.body.token;
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
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    expect(Array.isArray(response.body)).toBe(true); // Ensure response body is an array
    expect(response.body.length).toBeGreaterThan(0); // Ensure response contains at least one item
    expect(response.body[0]).toHaveProperty('name'); // Ensure response items have the required properties
    // Add more assertions as needed to validate the structure and content of the response
  });

  test('API returns correct user when valid id is passed', async () => {
    const StudentsInDB = await Students.find({});
    const StudentToCheck = StudentsInDB[0];
    const response = await api
      .get(`/api/students/${StudentToCheck._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.name).toContain(StudentToCheck.name); // Validate the name property
    // Add more assertions to validate other properties as needed
    expect(response.body.email).toBe(StudentToCheck.email);
    expect(response.body.password).not.toBeDefined(); // Ensure sensitive fields are not exposed
  });

  test('API returns 404 error when non-existent id is passed', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011'; // Assuming this ID does not exist in the database
    await api
      .get(`/api/students/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  test('API returns 400 error when invalid id format is passed', async () => {
    const invalidId = '12345'; // Invalid ID format
    await api
      .get(`/api/students/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  test('API returns 400 error when no token is provided', async () => {
    await api
      .get('/api/students/somevalidid')
      .expect(400)
      .expect('Invalid Token');
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

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('name', ValidUser.name);
    // Add more assertions to validate other properties if needed

    // Validate that the user object was added to the database
    const addedUser = await Students.findOne({ email: ValidUser.email });
    expect(addedUser).toBeTruthy(); // Check if the user exists in the database
  });

  test('Non-unique email gets rejected', async () => {
    const DuplicateUser = {
      name: 'Duplicate User',
      email: 'adalovelace@gmail.com', // Assuming this email already exists in the database
      password: 'foobar',
    };

    await api
      .post('/api/students')
      .send(DuplicateUser)
      .expect(400)
      .expect('Email already exists');
  });

  test('Invalid user object gets rejected', async () => {
    const InvalidUser = {
      // Missing 'email' field
      name: 'InvalidUser',
      password: 'foobar',
    };

    await api
      .post('/api/students')
      .send(InvalidUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    // Ensure no invalid user was added to the database
    const invalidUser = await Students.findOne({ name: InvalidUser.name });
    expect(invalidUser).toBeNull(); // Check if no invalid user was added to the database
  });
});

describe('POST /api/students', () => {
  test('Rejects user with missing fields', async () => {
    const incompleteUser = {
      name: 'Incomplete User',
      // Email and password are missing
    };

    await api
      .post('/api/students')
      .send(incompleteUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  test('Rejects user with invalid email format', async () => {
    const userWithInvalidEmail = {
      name: 'Bad Email User',
      email: 'not-an-email',
      password: 'foobar',
    };

    await api
      .post('/api/students')
      .send(userWithInvalidEmail)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});

describe('PUT /api/students/:id', () => {
  let studentToUpdateId;

  beforeAll(async () => {
    const student = new Students({
      name: 'ToBeUpdated',
      email: 'tobeupdated@example.com',
      password: 'password',
    });
    const savedStudent = await student.save();
    studentToUpdateId = savedStudent._id.toString();
  });

  test('Updates student with valid data', async () => {
    const updatedData = {
      name: 'Updated Name',
      email: 'updatedemail@example.com',
      password: 'newpassword',
    };

    const response = await api
      .put(`/api/students/${studentToUpdateId}`)
      .send(updatedData)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.name).toBe(updatedData.name);
  });

  test('Fails to update with invalid ID', async () => {
    const invalidId = 'invalidID';
    const newData = {
      name: 'Should Fail',
    };

    await api
      .put(`/api/students/${invalidId}`)
      .send(newData)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Invalid ID format');
  });

  test('Rejects update for non-existent ID', async () => {
    // Assuming the ID format is correct but does not exist in the database
    const nonExistentId = '507f1f77bcf86cd799439011';
    const updateData = {
      name: 'Non Existent',
      email: 'nonexistent@example.com',
      password: 'foobar'
    };

    await api
      .put(`/api/students/${nonExistentId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Student ID does not exist');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
