import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import login from './Style/Login.module.css';
import database from '../Services/database';
import Session from '../Services/Session';

const bcrypt = require('bcryptjs');
const eduhubJPG = require('./Style/Images/EduHub.png');

const LoginForm = ({
  user, emailChange, passwordChange, onSubmit,
}) => (
  <div className={login.loginform}>
    <p className={login.title}>
      {user}
      {' '}
      Login
    </p>
    <form onSubmit={onSubmit}>
      <div className={login.inputbox}>
        <input type="text" className={login.nameinput} onChange={emailChange} required />
        { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
        <label className={login.namelabel}> Email </label>
      </div>
      <div className={login.inputbox}>
        <input type="password" className={login.nameinput} onChange={passwordChange} required />
        { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
        <label className={login.namelabel}> Password </label>
      </div>
      <div className={login.buttonDiv}>
        <button type="submit" className={login.submitButton}> Login </button>
      </div>
    </form>
    <Link to="/register" className={login.buttonDiv}>
      <button type="button" className={login.register}> I don&apost Have an account</button>
    </Link>
  </div>
);

const Login = () => {
  const [user, setUser] = useState('Student');
  const [persons, setPersons] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    database.getAll(user).then((response) => setPersons(response)).catch(() => {
      navigate('/errorpage');
    });
  }, [user, navigate]);

  const changeUser = () => {
    if (user === 'Student') {
      setUser('Instructor');
    } else {
      setUser('Student');
    }
  };

  let alt;
  if (user === 'Student') {
    alt = 'Instructor';
  } else {
    alt = 'Student';
  }

  const emailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const passwordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const checkPerson = (event) => {
    event.preventDefault();
    const exists = persons.find((person) => person.email === newEmail);
    if (exists !== undefined) {
      if (bcrypt.compareSync(newPassword, exists.password)) { // exists.password === newPassword
        Session.setName(exists.name);
        Session.setId(exists.id);
        Session.setUsertype(user);
        if (user === 'Student') {
          navigate('/studentsdashboard', { replace: true, state: { user: exists } });
        } else {
          navigate('/instructorsdashboard', { replace: true, state: { user: exists } });
        }
      } else {
        alert('Wrong email or password');
      }
    } else {
      alert('User does not exist');
    }
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
      <Link to="/" className={login.back}>
        <button type="button" className={login.back} onClick={changeUser}> Back </button>
      </Link>
      <div className={login.Login}>
        <img src={eduhubJPG} className={login.image} alt="" />
        <LoginForm
          user={user}
          emailChange={emailChange}
          passwordChange={passwordChange}
          onSubmit={checkPerson}
        />
      </div>
    </div>
  );
};

export default Login;
