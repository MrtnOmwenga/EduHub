import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MyCourseStyle from './style/MyCourses.module.css';
import DataServices from '../services/Data';

const MyCourses = () => {
  const [courses, setCourse] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    DataServices.SetToken(token);

    const _ = async () => {
      try {
        const response = await DataServices.GetCourse(location.state.id);
        setCourse(response);
      } catch (error) {
        navigate('/errorpage');
      }
    };
    _();
  }, [location.state.id, navigate]);

  const coursesFiltered = courses?.modules;

  return (
    <div className={MyCourseStyle.outer_container}>
      <div className={MyCourseStyle.menu}>
        <h3 className={MyCourseStyle.title}>
          HUB
          {' '}
          <br />
          {' '}
          EDUCATION
        </h3>
        <ul className={MyCourseStyle.menu_list}>
          <Link
            to="/instructorsdashboard"
            state={{ ...user }}
            className={MyCourseStyle.link}
          >
            <li className={MyCourseStyle.menu_item}> DASHBOARD </li>

          </Link>
          <Link
            to="/courses"
            state={{ ...user }}
            className={MyCourseStyle.link}
          >
            <li className={MyCourseStyle.menu_item}> COURSES </li>

          </Link>
          {' '}
          <Link
            to="/indevelopment"
            state={{ ...user }}
            className={MyCourseStyle.link}
          >
            <li className={MyCourseStyle.menu_item}>QUIZZES</li>
          </Link>
          <Link
            to="/indevelopment"
            state={{ ...user }}
            className={MyCourseStyle.link}
          >
            <li className={MyCourseStyle.menu_item}>ACCOUNT</li>
          </Link>
          <Link
            to="/login"
            state={{ ...user }}
            className={MyCourseStyle.link}
          >
            <li className={MyCourseStyle.logout}> LOGOUT </li>
          </Link>
        </ul>
      </div>
      <div className={MyCourseStyle.main_content}>
        <h3 className={MyCourseStyle.main_title}>All Modules</h3>
        <ul className={MyCourseStyle.course_list}>
          {coursesFiltered?.map((course) => (
            <li className={MyCourseStyle.course_element} key={course.id}>
              <Link
                to="/documentviewer"
                state={{ file: course.file, user }}
                className={`${MyCourseStyle.course_info} ${MyCourseStyle.document_link} `}
              >
                <h4 className={MyCourseStyle.course_name}>
                  {course.name}
                  {' '}
                </h4>
                <p className={MyCourseStyle.course_instructor}>
                  {' '}
                  {course.file}
                  {' '}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <button className={MyCourseStyle.delete} type="button"> DELETE </button>
      </div>
    </div>
  );
};

export default MyCourses;
