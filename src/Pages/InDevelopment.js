import React from 'react';
import errorstyle from './Style/Errorpage.module.css';

const InDevelopmentPage = () => (
  <div className={errorstyle.error_div}>
    <h3> Sorry. &ensp;This Page is still in development and will be available to you shortly </h3>
  </div>
);

export default InDevelopmentPage;
