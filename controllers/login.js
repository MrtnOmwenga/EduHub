const LoginRoutes = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Students = require('../models/students');
const Instructors = require('../models/instructors');

LoginRoutes.post('/', async (request, response) => {
  const { email, password, UserType } = request.body;

  const user = UserType === 'Student' ? await Students.findOne({ email }) : await Instructors.findOne({ email });
  const CorrectPassword = user === null ? false : await bcrypt.compare(password, user.password);

  if (!(user && CorrectPassword)) {
    return response.status(401).send('Invalid username or password');
  }

  const forToken = {
    name: user.name,
    id: user._id,
  };
  const token = jwt.sign(forToken, process.env.SECRET);

  return response
    .status(200)
    .json({ token, name: user.name, id: user._id });
});

module.exports = LoginRoutes;
