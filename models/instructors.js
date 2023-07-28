const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  courses: [{
    name: String,
    students: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
    },
  }],
});

InstructorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.password;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Instructors', InstructorSchema);
