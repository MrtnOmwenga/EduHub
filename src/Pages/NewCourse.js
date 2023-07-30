import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import newCourse from './Style/NewCourse.module.css';
import DataServices from '../Services/Data';

const NewCourse = () => {
  const [moduleCount, setModuleCount] = useState(1);
  const [courseName, setCourseName] = useState('');
  const [modules, setModules] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const [file, setFile] = useState(null);
  const [instructor, setInstructor] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    const _ = async () => {
      const response = await DataServices.GetUser(user.id, 'instructors');
      setInstructor(response);
    };
    _();
  }, [user.id, navigate]);

  const moduleChange = (event) => setModuleName(event.target.value);
  const fileChange = (event) => setFile(event.target.files[0]);

  const addModule = async (event) => {
    event.preventDefault();

    if (file) {
      const newObject = {
        name: moduleName,
        file: `${moduleName}-${file.name}`,
      };

      /* eslint no-undef: "error" */
      const renamedFile = new File([file], `${moduleName}-${file.name}`);

      const data = new FormData();
      data.append('file', renamedFile);

      try {
        await DataServices.SaveFile(data);
      } catch (error) {
        console.log(error);
        navigate('/errorpage');
      }

      setModules(modules.concat(newObject));
      setModuleName('');
      setFile(null);
      setModuleCount(moduleCount + 1);

      toast.success('Module Added');
    } else {
      toast.error('Please Choose File before Adding another module');
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

  const courseChange = (event) => setCourseName(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const NewCourseObject = {
      name: courseName,
      instructor: user.name,
      modules: [],
    };

    modules.map((module) => {
      NewCourseObject.modules.push({
        name: module.name,
        file: module.file,
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
          id: response._id,
        }),
      };

      await DataServices.UpdateUser(instructor.id, 'instructors', newInstructor);
    } catch (error) {
      console.log(error);
      navigate('/errorpage');
    }
    navigate('/instructorsdashboard', { replace: true, state: { ...user } });
  };

  return (
    <div className={newCourse.body}>
      <Link to="/instructorsdashboard" state={{ ...user }} className={newCourse.back}>
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
      <ToastContainer />
    </div>
  );
};

export default NewCourse;
