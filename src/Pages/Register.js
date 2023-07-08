import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import register from './Style/Register.module.css';
import database from './Services/database';
import Session from './Services/Session';

const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const eduhubJPG = require('./Style/Images/EduHub.png');

const RegisterForm = ({
  user, nameChange, emailChange,
  passwordChange, onSubmit,
}) => (
  <div className={register.loginform}>
    <p className={register.title}>
      {user}
      {' '}
      Registration
    </p>
    <form onSubmit={onSubmit}>
      <div className={register.inputbox}>
        <input type="text" className={register.nameinput} onChange={nameChange} required />
        { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
        <label className={register.namelabel}> Name </label>
      </div>
      <div className={register.inputbox}>
        <input type="text" className={register.nameinput} onChange={emailChange} required />
        { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
        <label className={register.namelabel}> Email </label>
      </div>
      <div className={register.inputbox}>
        <input type="password" className={register.nameinput} onChange={passwordChange} required />
        { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
        <label className={register.namelabel}> Password </label>
      </div>
      <div className={register.buttonDiv}>
        <button type="submit" className={register.submitButton}> Register </button>
      </div>
    </form>
    <div className={register.buttonDiv}>
      <button type="button" className={register.register}> I don&apost Have an account</button>
    </div>
  </div>
);

const Register = () => {
  const [user, setUser] = useState('Student');
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
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

  const nameChange = (event) => {
    setNewName(event.target.value);
  };

  const emailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const passwordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const addStudent = () => {
    // event.preventDefault()
    const exists = persons.find((person) => person.email === newEmail);
    if (exists !== undefined) {
      alert(`${newEmail} is already exists`);
    } else {
      const hash = bcrypt.hashSync(newPassword, salt);
      const newObject = {
        name: newName,
        email: newEmail,
        password: hash, // newPassword
        id: persons.length + 1,
        courses: [],
      };

      database.addPerson(newObject, user).then((response) => {
        setPersons(persons.concat(response));
        setNewName('');
        setNewEmail('');
        setNewPassword('');
      }).catch(() => {
        navigate('/errorpage');
      });

      Session.setName(newObject.name);
      Session.setId(newObject.id);
      Session.setUsertype(user);
      navigate('/login', { replace: true });
      /* if (user === 'Student') {
                navigate('/studentsdashboard', {replace: true, state: {user: newObject}})
            }else {
                navigate('/instructorsdashboard', {replace: true, state: {user: newObject}})
            } */
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
          user={user}
          nameChange={nameChange}
          emailChange={emailChange}
          passwordChange={passwordChange}
          onSubmit={addStudent}
        />
      </div>
    </div>
  );
};

export default Register;
