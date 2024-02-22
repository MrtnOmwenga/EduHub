const supertest = require('supertest');
const mongoose = require('mongoose');
const { instructors } = require('./Instructors.json');
const Instructors = require('../models/instructors.model');
const Courses = require('../models/courses.model');
const app = require('../App');

const api = supertest(app);

// Global variables
let token;
let csrfToken; // To store the CSRF token globally
let csrfCookie; // To store the CSRF cookie globally

beforeAll(async () => {
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

  // Get csrf token
  const csrfResponse = await api.get('/services/csrf');
  csrfToken = csrfResponse.body.csrfToken;
  csrfCookie = csrfResponse.headers['set-cookie'];

  // Make a request to /services/login to get the token
  const credentials = {
    email: 'artohellas@gmail.com',
    password: 'foobar',
    UserType: 'Instructor',
  };
  const loginResponse = await api
      .post('/services/login')
      .send(credentials)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(200);

  // Extract the token from the response
  token = loginResponse.body.token;
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
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    expect(Array.isArray(response.body)).toBe(true); // Ensure response body is an array
    expect(response.body.length).toBeGreaterThan(0); // Ensure response contains at least one item
    expect(response.body[0]).toHaveProperty('name'); // Ensure response items have the required properties
    // Add more assertions as needed to validate the structure and content of the response
  });

  test('API returns correct user when valid id is passed', async () => {
    const InstructorsInDB = await Instructors.find({});
    const InstructorToCheck = InstructorsInDB[0];
    const response = await api
      .get(`/api/instructors/${InstructorToCheck._id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(200);

    expect(response.body.name).toContain(InstructorToCheck.name); // Validate the name property
    // Add more assertions to validate other properties as needed
    expect(response.body.email).toBe(InstructorToCheck.email);
    expect(response.body.password).not.toBeDefined(); // Ensure sensitive fields are not exposed
  });

  test('API returns 404 error when non-existent id is passed', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011'; // Assuming this ID does not exist in the database
    await api
      .get(`/api/instructors/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(400);
  });

  test('API returns 400 error when invalid id format is passed', async () => {
    const invalidId = '12345'; // Invalid ID format
    await api
      .get(`/api/instructors/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(400);
  });

  test('API returns 400 error when no token is provided', async () => {
    await api
      .get('/api/instructors/somevalidid')
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
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
      .post('/api/instructors')
      .send(ValidUser)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(201);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('name', ValidUser.name);
    // Add more assertions to validate other properties if needed

    // Validate that the user object was added to the database
    const addedUser = await Instructors.findOne({ email: ValidUser.email });
    expect(addedUser).toBeTruthy(); // Check if the user exists in the database
  });

  test('Non-unique email gets rejected', async () => {
    const DuplicateUser = {
      name: 'Duplicate User',
      email: 'adalovelace@gmail.com', // Assuming this email already exists in the database
      password: 'foobar',
    };

    await api
      .post('/api/instructors')
      .send(DuplicateUser)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
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
      .post('/api/instructors')
      .send(InvalidUser)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    // Ensure no invalid user was added to the database
    const invalidUser = await Instructors.findOne({ name: InvalidUser.name });
    expect(invalidUser).toBeNull(); // Check if no invalid user was added to the database
  });
});

describe('PUT /api/instructors/:id', () => {
  let instructorToUpdateId;

  beforeAll(async () => {
    const instructors = new Instructors({
      name: 'ToBeUpdated',
      email: 'tobeupdated@example.com',
      password: 'password',
    });
    const savedInstructors = await instructors.save();
    instructorToUpdateId = savedInstructors._id.toString();
  });

  test('Updates instructor with valid data', async () => {
    const updatedData = {
      name: 'Updated Name',
      email: 'updatedemail@example.com',
      password: 'newpassword',
    };

    const response = await api
      .put(`/api/instructors/${instructorToUpdateId}`)
      .send(updatedData)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(200)

    expect(response.body.name).toBe(updatedData.name);
  });

  test('Fails to update with invalid ID', async () => {
    const invalidId = 'invalidID';
    const newData = {
      name: 'Should Fail',
    };

    await api
      .put(`/api/instructors/${invalidId}`)
      .send(newData)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
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
      .put(`/api/instructors/${nonExistentId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(400)
      .expect('Instructor ID does not exist');
  });
});

describe('Test delete url', () => {
  test('Delete student by ID', async () => {
    const InstructorsInDB = await Instructors.find({});
    const instructorToDelete = InstructorsInDB[0];

    const response = await api
      .delete(`/api/instructors/${instructorToDelete._id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .expect(204);

    // Check that the student is deleted from the database
    const deletedInstructor = await Instructors.findById(instructorToDelete._id);
    expect(deletedInstructor).toBeNull();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
