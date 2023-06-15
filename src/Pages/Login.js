import { useState, useEffect } from "react"
import login from './Style/Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import database from './Services/database'
import Session from './Services/Session'

const LoginForm = ({user, emailChange, passwordChange, onSubmit}) => {

    return (
        <div className={login.loginform}>
            <p className={login.title}>{user} Login</p>
            <form onSubmit={onSubmit}>
                <div className={login.inputbox}>
                    <input type='text' className={login.nameinput} onChange={emailChange} required />
                    <label className={login.namelabel}> Email </label>
                </div>
                <div className={login.inputbox}>
                    <input type='password' className={login.nameinput} onChange={passwordChange} required />
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
    const [persons, setPersons] = useState([])
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        database.getAll(user).then(response => setPersons(response))
      }, [user])

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

    const emailChange = (event) => {
        setNewEmail(event.target.value)
    }

    const passwordChange = (event) => {
        setNewPassword(event.target.value)
    }

    const checkPerson = (event) => {
        event.preventDefault()
        const exists = persons.find((person) => person.email === newEmail)
        if (exists !== undefined) {
            if (exists.password === newPassword) {
                Session.setName(exists.name)
                Session.setId(exists.id)
                Session.setUsertype(user)
                if (user === 'Student') {
                    navigate('/studentsdashboard', {replace: true, state: {user: exists}})
                }else {
                    navigate('/instructorsdashboard', {replace: true, state: {user: exists}})
                }
            }else {
                alert('Wrong email or password')
            }
        }else {
            alert('User does not exist')
        }
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
                <LoginForm  user={user}
                emailChange={emailChange} passwordChange={passwordChange}
                onSubmit={checkPerson}/>
            </div>
        </div>
    )
}

export default Login