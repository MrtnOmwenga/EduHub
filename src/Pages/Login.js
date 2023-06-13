import { useState } from "react"
import login from './Style/Login.module.css'
import { Link } from 'react-router-dom'

const LoginForm = ({user, onClick}) => {

    return (
        <div className={login.loginform}>
            <p className={login.title}>{user} Login</p>
            <form>
                <div className={login.inputbox}>
                    <input type='text' className={login.nameinput} required />
                    <label className={login.namelabel}> Email </label>
                </div>
                <div className={login.inputbox}>
                    <input type='password' className={login.nameinput} required />
                    <label className={login.namelabel}> Password </label>
                </div>
                <div className={login.buttonDiv}>
                    <button type="submit" className={login.submitButton}> Login </button>
                </div>
            </form>
            <Link to={'/register'} className={login.buttonDiv}>
                <button className={login.register} > I don't Have an account</button>
            </Link>
        </div>
    )
}

const Login = () => {
    const [user, setUser] = useState('Student')

    const changeUser = () => {
        if (user === 'Student') {
            setUser('Instructor')
        }else {
            setUser('Student')
        }
    }

    let alt;
    if (user === 'Student') {
        alt = 'Instructor'
    }else {
        alt= 'Student'
    }

    return (
        <div className={login.LoginPage}>
            <div className={login.textcontainer}>
                <button className={login.changeuser} onClick={changeUser}>Login As {alt}</button>
            </div>
            <Link to={'/'} className={login.back}>
                <p className={login.back} onClick={changeUser}> Back </p>
            </Link>
            <div className={login.Login}>
                <img src={require('./Style/Images/EduHub.png')}  className={login.image} alt=""/>
                <LoginForm  user={user} onClick={changeUser}/>
            </div>
        </div>
    )
}

export default Login