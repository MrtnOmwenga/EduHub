import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import newCourse from './Style/NewCourse.module.css';
import database from '../Services/database';
import Session from '../Services/Session';

const NewCourse = () => {
  const [moduleCount, setModuleCount] = useState(1);
  const [courseName, setCourseName] = useState('');
  const [modules, setModules] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState('');
  const navigate = useNavigate();

  const user = { name: Session.getName(), id: Session.getId() };

  useEffect(() => {
    database.getCourses().then((course) => {
      setCourses(course);
    });

    database.getOne(user.id, 'Instructor').then((res) => {
      setInstructor(res);
    });
  }, [user.id, navigate]);

  const moduleChange = (event) => {
    setModuleName(event.target.value);
  };

  const fileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const addModule = (event) => {
    event.preventDefault();

    if (file) {
      const newObject = {
        name: moduleName,
        file: `${moduleName}-${file.name}`,
      };

      const renamedFile = new File([file], `${moduleName}-${file.name}`);

      const data = new FormData();
      data.append('file', renamedFile);

      database.saveFile(data).then(() => {
        console.log('Success');
      }).catch((e) => {
        console.error('Error', e);
      });

      setModules(modules.concat(newObject));
      setModuleName('');
      setFile(null);

      setModuleCount(moduleCount + 1);
    } else {
      alert('Please Choose File before Adding another module');
    }
  };

  const content = [];
  for (let count = 0; count < moduleCount; count++) {
    content.push(
      <div className={newCourse.module_element}>
        <input
          key={`module${count}`}
          className={newCourse.module_name}
          type="text"
          onChange={moduleChange}
          placeholder="Module name"
        />
        <input
          key={`file${count}`}
          className={newCourse.module_link}
          type="file"
          onChange={fileChange}
          accept="application/pdf"
        />
      </div>,
    );
  }

  const courseChange = (event) => {
    setCourseName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newObject = {
      name: courseName,
      id: courses.length + 1,
      instructor: user.name,
      modules: [],
    };

    modules.map((module) => {
      newObject.modules.push({
        name: module.name,
        file: module.file,
      });
      return null;
    });

    const newInstructor = {
      ...instructor,
      courses: instructor.courses.concat({
        name: courseName,
        id: courses.length + 1,
        students: 0,
      }),
    };

    database.addCourse(newObject).then((response) => {
      setCourses(courses.concat(response));
    }).catch(() => {
      navigate('/errorpage');
    });
    database.updateInstructor(user.id, newInstructor).catch(() => {
      navigate('/errorpage');
    });
    navigate('/instructorsdashboard', { replace: true, state: { user } });
  };

  return (
    <div className={newCourse.body}>
      <Link to="/instructorsdashboard" state={{ user }} className={newCourse.back}>
        <p className={newCourse.back}> Back </p>
      </Link>
      <form className={newCourse.form} onSubmit={handleSubmit}>
        <h3 className={newCourse.title}> Create Course </h3>
        <input className={newCourse.course_name} type="text" placeholder="Course Name" onChange={courseChange} />
        {content.map((resContent) => resContent)}
        <button type="button" className={newCourse.add_module} onClick={addModule}> Add Module </button>
        <div>
          <button className={newCourse.submit} type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default NewCourse;
