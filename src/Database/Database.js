const students = require('./Students.json');
const instructors = require('./Instructors.json');
// Something more

module.exports = () => ({
    students: students.students,
    instructors: instructors.instructors
  // Something more
});