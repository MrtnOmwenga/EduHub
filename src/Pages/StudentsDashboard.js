import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import dash from './Style/Dashboard.module.css';
import DataServices from '../Services/Data';

const StudentsDashboard = () => {
  const location = useLocation();
  const data = location.state;
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  if (data === null) {
    navigate('/errorpage');
  }

  useEffect(() => {
    const _ = async () => {
      const response = await DataServices.GetUser(data.id, 'students');
      setUser(response);
    };
    _();
  }, [data.id, navigate]);

  const viewCourse = (id) => {
    navigate('/coursepage', { replace: true, state: { id, data } });
  };

  return (
    <div className={dash.outer_container}>
      <div className={dash.menu}>
        <h3 className={dash.title}>
          HUB
          {' '}
          <br />
          {' '}
          EDUCATION
        </h3>
        <ul className={dash.menu_list}>
          <li className={dash.menu_item}>DASHBOARD</li>
          <Link
            to="/courses"
            state={{ ...data }}
            className={dash.link}
          >
            <li className={dash.menu_item}> COURSES </li>

          </Link>
          <Link
            to="/indevelopment"
            state={{ ...data }}
            className={dash.link}
          >
            <li className={dash.menu_item}>QUIZZES</li>
          </Link>
          <Link
            to="/indevelopment"
            state={{ ...data }}
            className={dash.link}
          >
            <li className={dash.menu_item}>INSTRUCTORS</li>
          </Link>
          <Link
            to="/indevelopment"
            state={{ ...data }}
            className={dash.link}
          >
            <li className={dash.menu_item}>ACCOUNT</li>
          </Link>
          <Link
            to="/login"
            state={{ ...data }}
            className={dash.link}
          >
            <li className={dash.menu_item}> LOGOUT </li>
          </Link>
        </ul>
      </div>
      <div className={dash.content}>
        <h2 className={dash.main_title}>
          Welcome
          {' '}
          {user.name}
        </h2>
        <table className={dash.course_list}>
          <thead className={dash.table_head}>
            <tr>
              <th> COURSE NAME</th>
              <th> GRADE</th>
              <th>  </th>
            </tr>
          </thead>
          <tbody>
            {user.courses?.map((course) => (
              <tr className={dash.course_element} key={course.id}>
                <th className={dash.course_name}>{course.name}</th>
                <th className={dash.course_grade}>{course.grade}</th>
                <th className={dash.course_button}>
                  <button type="button" className={dash.course_btn} onClick={() => viewCourse(course.id)}>
                    {' '}
                    Study
                    <FaArrowRight className={dash.course_txt} />
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsDashboard;
