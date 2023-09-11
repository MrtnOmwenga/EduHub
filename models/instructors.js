const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const InstructorSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  courses: [{
    name: String,
    students: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
    },
  }],
});

InstructorSchema.plugin(uniqueValidator);

InstructorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.password;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Instructors', InstructorSchema);
