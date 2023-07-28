import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import courseStyle from './Style/Courses.module.css';
import DataServices from '../Services/Data';

const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [filter, setFilter] = useState('');
  const [student, setStudent] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    const _ = async () => {
      try {
        const response = await DataServices.GetAllCourses();
        setCourse(response);

        const res = await DataServices.GetUser(user.id, 'students');
        setStudent(res);
      } catch (error) {
        console.log(error);
        navigate('/errorpage');
      }
    };
    _();
  }, [user.id, navigate]);

  const searchFilter = (event) => {
    setFilter(event.target.value);
  };

  const viewCourse = async (course) => {
    if (user.UserType === 'Student') {
      const exists = student.courses.filter((enrolledCourse) => enrolledCourse.id === course.id);
      if (exists === undefined || exists.length === 0) {
        const newStudent = {
          ...student,
          courses: student.courses.concat({
            name: course.name,
            id: course.id,
            grade: 0,
          }),
        };

        try {
          await DataServices.UpdateUser(user.id, 'students', newStudent);
        } catch (error) {
          console.log(error);
          navigate('/errorpage');
        }
      } else {
        /* eslint-disable */
        alert('You are already enrolled to this course');
      }
    }
    navigate('/coursepage', { replace: true, state: { id: course.id, user } });
  };

  const filteredData = courses.filter((course) => course.name.toLowerCase() === filter.toLowerCase());
  const coursesFiltered = filteredData.length === 0 ? courses : filteredData;

  const baseUrl = user.UserType === 'Student' ? '/studentsdashboard' : '/instructorsdashboard';
  const buttonText = user.UserType === 'Student' ? 'Enroll' : 'View';

  return (
    <div className={courseStyle.outer_container}>
      <Link to={baseUrl} state={{ ...user }} className={courseStyle.back}>
        <p className={courseStyle.back}> Back </p>
      </Link>
      <h3 className={courseStyle.title}>All courses</h3>
      <input className={courseStyle.filter} placeholder="Search" onChange={searchFilter} value={filter} />
      <ul className={courseStyle.course_list}>
        {coursesFiltered?.map((course) => (
          <li className={courseStyle.course_element} key={course.id}>
            <div className={courseStyle.course_info}>
              <h4 className={courseStyle.course_name}>
                {course.name}
                {' '}
              </h4>
              <p className={courseStyle.course_instructor}>
                {' '}
                {course.instructor}
                {' '}
              </p>
            </div>
            <button type="button" className={courseStyle.enroll_button} onClick={() => viewCourse(course)}>
              {' '}
              {buttonText}
              {' '}
              <FaArrowRight className={courseStyle.course_icon} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
