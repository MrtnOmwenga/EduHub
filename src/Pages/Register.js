import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import register from './Style/Register.module.css';
import RegisterService from '../Services/Register';
import RegisterForm from '../Components/RegisterForm';

const eduhubJPG = require('./Style/Images/EduHub.png');

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
      await RegisterService.Register({ name, email, password }, UserType);
      navigate('/login', { replace: true });
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log(error);
      toast.error('Wrong Credentials');
    }
  };

  return (
    <div className={register.LoginPage}>
      <div className={register.textcontainer}>
        <button type="button" className={register.changeuser} onClick={changeUser}>
          Register As
          {' '}
          {alt}
        </button>
      </div>
      <Link to="/" className={register.back}>
        <button type="button" className={register.back} onClick={changeUser}> Back </button>
      </Link>
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
