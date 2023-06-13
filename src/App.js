import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
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
      </Routes>
    </Router>
  );
}

export default App;
