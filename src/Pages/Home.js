import React from 'react';
import { Link } from 'react-router-dom';
import style from './Style/Home.module.css';

const meetingJPG = require('./Style/Images/BoardMeeting.png');
const backgroundJPG = require('./Style/Images/Background.jpg');

const Home = () => (
  <div className={style.stylePage}>
    <section className={style.Section1}>
      <nav className={style.navigation}>
        <button type="button" className={style.navbutton}>
          <p className={style.buttontext}>
            <Link to="/login" className={style.buttontext}> LOGIN </Link>
            {' '}
            |
            <Link to="/register" className={style.buttontext}>REGISTER</Link>
          </p>
        </button>
      </nav>
      <div className={style.container}>
        <div className={style.textcontainer}>
          <h1 className={style.title}>
            {' '}
            HUB
            <br />
            {' '}
            EDUCATION
            {' '}
          </h1>
          <h3 className={style.bite}> LEARN. GROW. PROSPER</h3>
          <h5 className={style.text1}> SELFPACED ON DEMAND LEARNING ANYWHERE ANY TIME </h5>
          <Link to="/register">
            <button type="button" className={style.registerbutton}>
              {' '}
              <p>REGISTER NOW</p>
              {' '}
            </button>
          </Link>
        </div>
      </div>
    </section>
    <section className={style.Section3}>
      <div className={style.textcontainer3}>
        <h2 className={style.title3}> AVAILABLE MATERIAL</h2>
        <p className={style.subText}> HUB EDUCATION </p>
        <div className={style.ImageSlides}>
          <div className={`${style.slide1} ${style.slides}`}>
            <div className={style.circle}><h1 className={style.slideNumber}>1</h1></div>
            <div className={style.Activities}>
              <h1 className={style.Activitytitle}>DETAILED NOTES</h1>
              <p className={style.activitiestext}>
                Our notes are sufficiently detailed, simply written and
                thoroughly vetted to allow you to learn as fast as possible
                getting the most out of your
                time wherever you are.
              </p>
            </div>
          </div>
          <div className={`${style.slide2} ${style.slides}`}>
            <div className={style.circle}><h1 className={style.slideNumber}>2</h1></div>
            <div className={style.Activities}>
              <h1 className={style.Activitytitle}> INTERACTIVE QUIZZES </h1>
              <p className={style.activitiestext}>
                {' '}
                Quizzes are specially
                designed by talented instructors to quide and reward effort rather than punish
                failure.
              </p>
            </div>
          </div>
          <div className={`${style.slide3} ${style.slides}`}>
            <div className={style.circle}><h1 className={style.slideNumber}>3</h1></div>
            <div className={style.Activities}>
              <h1 className={style.Activitytitle}> ONE ON ONE COACHING</h1>
              <p className={style.activitiestext}>
                Instructors are available round the clock
                for questions and consultation to support you and ensure you achieve
                your academic goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className={style.Section2}>
      <img src={meetingJPG} className={style.SpanImage} alt="" />
      <div className={style.textcontainer1}>
        <h1 className={style.AboutUstitle}> AboutUs </h1>
        <p className={style.aboutus}>
          Hub Education is an online platform that provides users with a seamless
          learning experience for accessing courses, taking assessments,
          and earning certifications. It&aposs user friendly, accessible from anywhere globally,
          and offers various courses across various subjects.
        </p>
        <button type="button" className={style.registerbutton}>
          {' '}
          <p className={style.buttontext}> Learn More </p>
        </button>
      </div>
    </section>
    <section className={style.Section4}>
      <div className={style.textcontainer4}>
        <h1 className={style.title4}> KEY FACILITATORS </h1>
        <div className={style.instructors}>
          <div className={`${style.instructor1} ${style.instructor}`}>
            <h3 className={style.instructorname}> SHAWN MICHAELS, PHD</h3>
            <p className={style.instructordetails}>
              Professor Michaels will be sharing his
              work on mobile education platforms for indigent students.
            </p>
          </div>
          <div className={`${style.instructor2} ${style.instructor}`}>
            <h3 className={style.instructorname}>ELLE PIP, PHD</h3>
            <p className={style.instructordetails}>
              A researcher and BSU faculty member since 2010,
              Dr. Pip will be joining the summit to speak about new horizons for education.
            </p>
          </div>
          <div className={`${style.instructor3} ${style.instructor}`}>
            <h3 className={style.instructorname}>GRACE JUDDER, PHD</h3>
            <p className={style.instructordetails}>
              Dr. Judder has been working on immersive learning platforms.
              He will be sharing his latest findings and best practices.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className={style.Section5}>
      <div className={style.textcontainer5}>
        <div className={style.contactus}>
          <h2 className={style.reachout}>Reach Out</h2>
          <h3 className={style.contacttitle}>Mailing Adress</h3>
          <p className={style.contactinfo}>
            123 Anywhere St., Any City
            <br />
            {' '}
            State, Country 12345
          </p>
          <h3 className={style.contacttitle}>Email Adress</h3>
          <p className={style.contactinfo}>hello@reallygreatsite.com</p>
          <h3 className={style.contacttitle}>Phone Number</h3>
          <p className={style.contactinfo}>(123) 456 7890</p>
        </div>
        <img src={backgroundJPG} className={style.contactimage} alt="" />
      </div>
    </section>
  </div>
);

export default Home;
