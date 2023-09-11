import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import courseStyle from './Style/Courses.module.css';
import DataServices from '../Services/Data';

const CoursePage = () => {
  const [courses, setCourse] = useState();
  const [filter, setFilter] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;

  if (user === null) {
    navigate('/errorpage');
  }

  useEffect(() => {
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

  const searchFilter = (event) => {
    setFilter(event.target.value);
  };

  const filteredData = courses?.modules.filter((module) => module.name.toLowerCase() === filter.toLowerCase());
  const coursesFiltered = filteredData?.length === 0 ? courses?.modules : filteredData;

  const baseUrl = user.UserType === 'Student' ? '/studentsdashboard' : '/instructorsdashboard';

  const back = () => {
    navigate(baseUrl, { replace: true, state: { ...user } });
  };

  return (
    <div className={courseStyle.outer_container}>
      <FaArrowLeft size={25} className={courseStyle.back} onClick={back} />
      <h3 className={courseStyle.title}>All Modules</h3>
      <input className={courseStyle.filter} placeholder="Search" onChange={searchFilter} value={filter} />
      <ul className={courseStyle.course_list}>
        {coursesFiltered?.map((course) => (
          <li className={courseStyle.course_element} key={course.id}>
            <Link
              to="/documentviewer"
              state={{ file: course.file }}
              className={`${courseStyle.course_info} ${courseStyle.document_link} `}
            >
              <h4 className={courseStyle.course_name}>
                {course.name}
                {' '}
              </h4>
              <p className={courseStyle.course_instructor}>
                {' '}
                {course.file}
                {' '}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursePage;
