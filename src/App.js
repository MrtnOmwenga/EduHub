import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import StudentsDashboard from './views/StudentsDashboard';
import InstructorsDashboard from './views/InstructorDashboard';
import Courses from './views/Courses';
import NewCourse from './views/NewCourse';
import CoursePage from './views/CoursePage';
import MyCourses from './views/MyCourses';
import ErrorPage from './views/Error';
import InDevelopmentPage from './views/InDevelopment';
import DocumentViewer from './components/DocumentViewer';

const App = () => (
  <Router>
    <div className="App" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route exact path="/studentsdashboard" element={<StudentsDashboard />} />
      <Route path="/instructorsdashboard" element={<InstructorsDashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/newcourse" element={<NewCourse />} />
      <Route path="/coursepage" element={<CoursePage />} />
      <Route path="/mycourses" element={<MyCourses />} />
      <Route path="/errorpage" element={<ErrorPage />} />
      <Route path="/indevelopment" element={<InDevelopmentPage />} />
      <Route path="/documentviewer" element={<DocumentViewer />} />
    </Routes>
  </Router>
);

export default App;
