import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
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
      const user = await RegisterService.Register({ name, email, password }, UserType);
      if (UserType === 'Student') {
        navigate('/studentsdashboard', { replace: true, state: { ...user, UserType } });
      } else {
        navigate('/instructorsdashboard', { replace: true, state: { ...user, UserType } });
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log(error);
      toast.error('Wrong Credentials');
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
