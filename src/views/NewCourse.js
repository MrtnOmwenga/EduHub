import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaX } from 'react-icons/fa6';
import newCourse from './style/NewCourse.module.css';
import DataServices from '../services/Data';

const NewCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [ModuleList, setModuleList] = useState([
    { id: 1, name: '', file: null },
  ]);
  const [instructor, setInstructor] = useState('');

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
      const response = await DataServices.GetUser(user.id, 'instructors');
      setInstructor(response);
    };
    _();
  }, [user.id, navigate]);

  const ModuleChange = (id, name) => {
    setModuleList((prevModuleList) => {
      const updatedList = prevModuleList.map((item) => (item.id === id ? { ...item, name } : item));
      return updatedList;
    });
  };
  const FileChange = async (id, file) => {
    await setModuleList((prevModuleList) => {
      const updatedList = prevModuleList.map((item) => (item.id === id ? { ...item, file } : item));
      return updatedList;
    });
  };

  const addModule = async (event) => {
    event.preventDefault();

    const newId = ModuleList.length + 1;
    setModuleList([...ModuleList, { id: newId, name: '', file: null }]);
  };

  const RemoveModule = (id) => {
    setModuleList((prevModuleList) => {
      const updatedList = prevModuleList.filter((item) => item.id !== id);
      toast.success('Module removed');
      return updatedList;
    });
  };

  const courseChange = (event) => setCourseName(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const NewCourseObject = {
      name: courseName,
      instructor: user.name,
      modules: [],
    };

    ModuleList.map((module) => {
      console.log(module);

      if (module.file === null) {
        toast.error(`Please choose a file for ${module.name}`);
        return null;
      }
      NewCourseObject.modules.push({
        name: module.name,
        file: `${module.name}-${module.file.name}`,
      });

      return null;
    });

    try {
      const response = await DataServices.CreateCourse(NewCourseObject);

      const newInstructor = {
        ...instructor,
        courses: instructor.courses.concat({
          name: courseName,
          students: 0,
          id: response.id,
        }),
      };

      await DataServices.UpdateUser(instructor.id, 'instructors', newInstructor);

      ModuleList.forEach(async (module) => {
        const FileObject = new File([module.file], `${module.name}-${module.file.name}`);

        const data = new FormData();
        data.append('file', FileObject);

        try {
          await DataServices.SaveFile(data);
        } catch (error) {
          navigate('/errorpage');
        }
      });
    } catch (error) {
      navigate('/errorpage');
    }
    navigate('/instructorsdashboard', { replace: true, state: { ...user } });
  };

  return (
    <div className={newCourse.body}>
      <div className={newCourse.menu}>
        <h3 className={newCourse.menu_title}>
          HUB
          {' '}
          <br />
          {' '}
          EDUCATION
        </h3>
        <ul className={newCourse.menu_list}>
          <Link
            to="/instructorsdashboard"
            state={{ ...user }}
            className={newCourse.link}
          >
            <li className={newCourse.menu_item}>DASHBOARD</li>
          </Link>
          {' '}
          <Link
            to="/courses"
            state={{ ...user }}
            className={newCourse.link}
          >
            <li className={newCourse.menu_item}> COURSES </li>

          </Link>
          {' '}
          <Link
            to="/indevelopment"
            state={{ ...user }}
            className={newCourse.link}
          >
            <li className={newCourse.menu_item}>QUIZZES</li>
          </Link>
          <Link
            to="/indevelopment"
            state={{ ...user }}
            className={newCourse.link}
          >
            <li className={newCourse.menu_item}>ACCOUNT</li>
          </Link>
          <Link
            to="/login"
            state={{ ...user }}
            className={newCourse.link}
          >
            <li className={newCourse.logout}> LOGOUT </li>
          </Link>
        </ul>
      </div>
      <div className={newCourse.form_container}>
        <form className={newCourse.form} onSubmit={handleSubmit}>
          <h3 className={newCourse.title}> Create Course </h3>
          <input className={newCourse.course_name} type="text" placeholder="Course Name" onChange={courseChange} />
          {ModuleList.map((item) => (
            <div className={newCourse.module_element}>
              <input
                key={`name_${item.id}`}
                value={item.name}
                className={newCourse.module_name}
                type="text"
                onChange={(e) => ModuleChange(item.id, e.target.value)}
                placeholder="Module name"
              />
              { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
              <label htmlFor="file" className={`${newCourse.label} ${item.file ? newCourse.FileSelected : ''}`}>
                <input
                  key={`file_${item.id}`}
                  className={newCourse.module_link}
                  type="file"
                  onChange={(e) => FileChange(item.id, e.target.files[0])}
                  accept="application/pdf"
                  id="file"
                />
                <span>{item.file ? item.file.name : 'Select a file'}</span>
              </label>
              <FaX className={newCourse.remove_module} onClick={() => RemoveModule(item.id)} />
            </div>
          ))}
          <button type="button" className={newCourse.add_module} onClick={addModule}> Add Module </button>
          <div>
            <button className={newCourse.submit} type="submit">Submit</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewCourse;
