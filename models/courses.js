const mongoose = require('mongoose');

const CoursesSchema = new mongoose.Schema({
  name: String,
  instructor: String,
  modules: [{
    name: String,
    file: String,
  }],
});

CoursesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Courses', CoursesSchema);
