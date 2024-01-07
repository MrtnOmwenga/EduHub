import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import register from './style/Register.module.css';
import RegisterService from '../services/Register';
import RegisterForm from '../components/RegisterForm';
import DataServices from '../services/Data';

const eduhubJPG = require('./style/images/EduHub.png');

const Register = () => {
  const [UserType, setUserType] = useState('Student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const changeUser = () => (UserType === 'Student' ? setUserType('Instructor') : setUserType('Student'));
  const alt = () => (UserType === 'Student' ? 'Instructor' : 'Student');

  const NameChange = (event) => setName(event.target.value);
  const EmailChange = (event) => setEmail(event.target.value);
  const PasswordChange = (event) => setPassword(event.target.value);

  const CreateUser = async (event) => {
    event.preventDefault();
    try {
      const user = await RegisterService.Register({ name, email, password }, UserType);
      DataServices.SetToken(user.token);
      if (UserType === 'Student') {
        navigate('/studentsdashboard', { replace: true, state: { ...user, UserType } });
      } else {
        navigate('/instructorsdashboard', { replace: true, state: { ...user, UserType } });
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const back = () => {
    navigate('/');
  };

  return (
    <div className={register.LoginPage}>
      <div className={register.textcontainer}>
        <button type="button" className={register.changeuser} onClick={changeUser}>
          {`Register as ${alt()}`}
        </button>
      </div>
      <FaArrowLeft size={25} className={register.back} onClick={back} />
      <div className={register.Login}>
        <img src={eduhubJPG} className={register.image} alt="" />
        <RegisterForm
          user={UserType}
          nameChange={NameChange}
          emailChange={EmailChange}
          passwordChange={PasswordChange}
          onSubmit={CreateUser}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
