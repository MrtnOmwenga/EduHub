const students = require('./Students.json');
const instructors = require('./Instructors.json');
const courses = require('./Courses.json')
// Something more

module.exports = () => ({
    student: students.students,
    instructor: instructors.instructors,
    courses: courses.courses
  // Something more
});