import React from 'react';
import register from '../views/style/Register.module.css';

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
      <button type="button" className={register.register}> I don&lsquo;t Have an account</button>
    </div>
  </div>
);

export default RegisterForm;
