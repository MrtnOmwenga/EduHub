import React from 'react';
import { Link } from 'react-router-dom';
import login from '../Pages/Style/Login.module.css';

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

export default LoginForm;
