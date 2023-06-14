const students = require('./Students.json');
const instructors = require('./Instructors.json');
// Something more

module.exports = () => ({
    student: students.students,
    instructor: instructors.instructors
  // Something more
});