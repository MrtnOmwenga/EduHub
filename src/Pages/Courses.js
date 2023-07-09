import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import courseStyle from './Style/Courses.module.css';
import database from '../Services/database';
import Session from '../Services/Session';

const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [filter, setFilter] = useState('');
  const [student, setStudent] = useState('');
  const navigate = useNavigate();

  const user = { name: Session.getName(), id: Session.getId() };

  useEffect(() => {
    database.getCourses().then((course) => {
      setCourse(course);
    }).catch(() => {
      navigate('/errorpage');
    });

    database.getOne(user.id, 'Student').then((res) => {
      setStudent(res);
    }).catch(() => {
      navigate('/errorpage');
    });
  }, [user.id, navigate]);

  const searchFilter = (event) => {
    setFilter(event.target.value);
  };

  const viewCourse = (course) => {
    if (Session.getUser() === 'Student') {
      const exists = student.courses.filter((enrolledCourse) => enrolledCourse.id === course.id);
      console.log(exists);
      if (exists === undefined || exists.length === 0) {
        const newStudent = {
          ...student,
          courses: student.courses.concat({
            name: course.name,
            id: course.id,
            grade: 0,
          }),
        };

        database.updatePerson(user.id, newStudent).catch(() => {
          navigate('/errorpage');
        });
      } else {
        alert('You are already enrolled to this course');
      }
    }
    navigate('/coursepage', { replace: true, state: { id: course.id } });
  };

  const filteredData = courses.filter((course) => course.name.toLowerCase() === filter.toLowerCase());
  const coursesFiltered = filteredData.length === 0 ? courses : filteredData;

  const baseUrl = Session.getUser() === 'Student' ? '/studentsdashboard' : '/instructorsdashboard';
  const buttonText = Session.getUser() === 'Student' ? 'Enroll' : 'View';

  return (
    <div className={courseStyle.outer_container}>
      <Link to={baseUrl} state={{ user }} className={courseStyle.back}>
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
