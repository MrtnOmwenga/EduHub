import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import login from './Style/Login.module.css';
import LoginForm from '../Components/LoginForm';
import LoginService from '../Services/Login';

const eduhubJPG = require('./Style/Images/EduHub.png');

const Login = () => {
  const [UserType, setUsertype] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const changeUser = () => (UserType === 'Student' ? setUsertype('Instructor') : setUsertype('Student'));
  const alt = UserType === 'Student' ? 'Instructor' : 'Student';

  const emailChange = (event) => setEmail(event.target.value);
  const passwordChange = (event) => setPassword(event.target.value);

  const HandleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await LoginService.Login({ email, password, UserType });
      toast.success('Successful login');
      if (UserType === 'Student') {
        navigate('/studentsdashboard', { replace: true, state: { ...user, UserType } });
      } else {
        navigate('/instructorsdashboard', { replace: true, state: { ...user, UserType } });
      }
      setEmail('');
      setPassword('');
    } catch (exception) {
      console.log(exception);
      toast.error('Incorrect username or password');
    }
  };

  const back = () => {
    navigate('/');
  };

  return (
    <div className={login.LoginPage}>
      <div className={login.textcontainer}>
        <button type="button" className={login.changeuser} onClick={changeUser}>
          Login As
          {' '}
          {alt}
        </button>
      </div>
      <FaArrowLeft size={25} className={login.back} onClick={back} />
      <div className={login.Login}>
        <img src={eduhubJPG} className={login.image} alt="" />
        <LoginForm
          user={UserType}
          emailChange={emailChange}
          passwordChange={passwordChange}
          onSubmit={HandleLogin}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
