import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import StudentsDashboard from './Pages/StudentsDashboard'
import InstructorsDashboard from './Pages/InstructorDashboard'
import Courses from './Pages/Courses'
import NewCourse from './Pages/NewCourse'
import CoursePage from './Pages/CoursePage'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
      </div>
      <Routes>
        <Route path={'/'} element={<Home />}/>
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
        <Route exact path={'/studentsdashboard'} element={<StudentsDashboard />} />
        <Route path={'/instructorsdashboard'} element={<InstructorsDashboard />} />
        <Route path={'/courses'} element={<Courses />} />
        <Route path={'/newcourse'} element={<NewCourse />} />
        <Route path={'/coursepage'} element={<CoursePage />} />
      </Routes>
    </Router>
  );
}

export default App;
