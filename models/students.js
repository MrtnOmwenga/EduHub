const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  courses: [{
    name: String,
    enrollment_date: String,
    grade: Number,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
    },
  }],
});

StudentsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.password;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Students', StudentsSchema);
