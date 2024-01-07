import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import courseStyle from './style/Courses.module.css';
import DataServices from '../services/Data';

const Courses = () => {
  const [courses, setCourse] = useState([]);
  const [filter, setFilter] = useState('');
  const [student, setStudent] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  if (user === null) {
    navigate('/errorpage');
  }

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    DataServices.SetToken(token);

    const _ = async () => {
      try {
        const response = await DataServices.GetAllCourses();
        setCourse(response);

        const res = await DataServices.GetUser(user.id, 'students');
        setStudent(res);
      } catch (error) {
        toast.error(`${error}`);
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
          toast.error(`${error}`);
          setTimeout(() => {
            navigate('/errorpage');
          }, 5000);
        }
      } else {
        toast('You are already enrolled to this course');
      }
    }
    navigate('/coursepage', { replace: true, state: { id: course.id, user } });
  };

  const filteredData = courses.filter((course) => course.name.toLowerCase() === filter.toLowerCase());
  const coursesFiltered = filteredData.length === 0 ? courses : filteredData;

  const baseUrl = user.UserType === 'Student' ? '/studentsdashboard' : '/instructorsdashboard';
  const buttonText = user.UserType === 'Student' ? 'Enroll' : 'View';

  const back = () => {
    navigate(baseUrl, { replace: true, state: { ...user } });
  };

  return (
    <div className={courseStyle.outer_container}>
      <FaArrowLeft size={25} className={courseStyle.back} onClick={back} />
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
            <div className={courseStyle.btn_container}>
              <button type="button" className={courseStyle.enroll_button} onClick={() => viewCourse(course)}>
                {' '}
                {buttonText}
                {' '}
                <FaArrowRight className={courseStyle.course_icon} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default Courses;
