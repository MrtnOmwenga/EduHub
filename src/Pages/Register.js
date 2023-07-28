import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import register from './Style/Register.module.css';
import database from '../Services/database';
import Session from '../Services/Session';
import RegisterForm from '../Components/RegisterForm';

const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const eduhubJPG = require('./Style/Images/EduHub.png');

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
