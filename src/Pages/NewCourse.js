import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import newCourse from './Style/NewCourse.module.css';
import DataServices from '../Services/Data';

let FileList = [];
let modules = [];

const NewCourse = () => {
  const [moduleCount, setModuleCount] = useState(1);
  const [courseName, setCourseName] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [file, setFile] = useState(null);
  const [instructor, setInstructor] = useState('');
  let ModuleComplete = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  if (user === null) {
    navigate('/errorpage');
  }

  useEffect(() => {
    const _ = async () => {
      const response = await DataServices.GetUser(user.id, 'instructors');
      setInstructor(response);
    };
    _();
  }, [user.id, navigate]);

  const moduleChange = (event) => {
    setModuleName(event.target.value);
    ModuleComplete = false;
  };
  const fileChange = (event) => {
    setFile(event.target.files[0]);
    ModuleComplete = false;
  };

  const SaveModule = async () => {
    if (file) {
      const newObject = {
        name: moduleName,
        file: `${moduleName}-${file.name}`,
      };

      const renamedFile = new File([file], `${moduleName}-${file.name}`);

      FileList.push(renamedFile);
      modules.push(newObject);

      console.log(modules);

      ModuleComplete = true;
      setModuleName('');
      setFile(null);
    } else {
      toast.error('Please Choose File before Adding another module');
    }
  };

  const addModule = async (event) => {
    event.preventDefault();

    try {
      await SaveModule();
      setModuleCount(moduleCount + 1);
      toast.success('Module Added');
    } catch (error) {
      console.log(error);
    }
  };

  const RemoveModule = () => {
    modules.splice(-1);
    FileList.splice(-1);
    setModuleName('');
    setFile(null);
    setModuleCount(moduleCount - 1);

    toast.success('Module removed');
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

    if (ModuleComplete) {
      SaveModule();
    }

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
          id: response.id,
        }),
      };

      await DataServices.UpdateUser(instructor.id, 'instructors', newInstructor);

      FileList.forEach(async (FileObject) => {
        const data = new FormData();
        data.append('file', FileObject);

        try {
          await DataServices.SaveFile(data);
        } catch (error) {
          navigate('/errorpage');
        }
      });

      FileList = [];
      modules = [];
    } catch (error) {
      navigate('/errorpage');
    }
    navigate('/instructorsdashboard', { replace: true, state: { ...user } });
  };

  const back = () => {
    navigate('/instructorsdashboard', { replace: true, state: { ...user } });
  };

  return (
    <div className={newCourse.body}>
      <FaArrowLeft size={25} className={newCourse.back} onClick={back} />
      <form className={newCourse.form} onSubmit={handleSubmit}>
        <h3 className={newCourse.title}> Create Course </h3>
        <input className={newCourse.course_name} type="text" placeholder="Course Name" onChange={courseChange} />
        {content.map((resContent) => resContent)}
        <button type="button" className={newCourse.add_module} onClick={addModule}> Add Module </button>
        <button type="button" className={newCourse.remove_module} onClick={RemoveModule}> Remove Module </button>
        <div>
          <button className={newCourse.submit} type="submit">Submit</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default NewCourse;
