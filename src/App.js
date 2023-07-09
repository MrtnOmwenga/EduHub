import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import StudentsDashboard from './Pages/StudentsDashboard';
import InstructorsDashboard from './Pages/InstructorDashboard';
import Courses from './Pages/Courses';
import NewCourse from './Pages/NewCourse';
import CoursePage from './Pages/CoursePage';
import ErrorPage from './Pages/ErrorPage';
import DocumentViewer from './Components/DocumentViewer';

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
      <Route path="/errorpage" element={<ErrorPage />} />
      <Route path="/documentviewer" element={<DocumentViewer />} />
    </Routes>
  </Router>
);

export default App;
