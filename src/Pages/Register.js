import { useState, useEffect } from "react"
import register from './Style/Register.module.css'
import { Link } from 'react-router-dom'
import database from './../Services/database'

const RegisterForm = ({user, onClick}) => {

    return (
        <div className={register.loginform}>
            <p className={register.title}>{user} Registration</p>
            <form>
            <div className={register.inputbox}>
                    <input type='text' className={register.nameinput} required />
                    <label className={register.namelabel}> Name </label>
                </div>
                <div className={register.inputbox}>
                    <input type='text' className={register.nameinput} required />
                    <label className={register.namelabel}> Email </label>
                </div>
                <div className={register.inputbox}>
                    <input type='password' className={register.nameinput} required />
                    <label className={register.namelabel}> Password </label>
                </div>
                <div className={register.buttonDiv}>
                    <button type="submit" className={register.submitButton}> Register </button>
                </div>
            </form>
            <div className={register.buttonDiv}>
                <button className={register.register} > I don't Have an account</button>
            </div>
        </div>
    )
}

const Register = () => {
    const [user, setUser] = useState('Student')
    const [students, setStudents] = useState([])
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        database.getAll().then(response => setStudents(response))
      }, [])

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

    const nameChange = (event) => {
        setNewName(event.target.value)
    }

    const emailChange = (event) => {
        setNewEmail(event.target.value)
    }

    const passwordChange = (event) => {
        setNewPassword(event.target.value)
    }

    const addStudent = (event) => {
        event.preventDefault()
        const exists = students.find((student) => student.name === newEmail)
        if (exists !== undefined)
        {
            alert(newName + " is already exists")
        } else {
            const newObject = {
                name: newName,
                email: newEmail,
                password: newPassword,
                id: students.length + 1
            }
    
            database.addPerson(newObject).then(response => {
                setStudents(students.concat(response))
                setNewName('')
            })
        }
    }

    return (
        <div className={register.LoginPage}>
            <div className={register.textcontainer}>
                <button className={register.changeuser} onClick={changeUser}>Register As {alt}</button>
            </div>
            <Link to={'/'} className={register.back}>
                <p className={register.back} onClick={changeUser}> Back </p>
            </Link>
            <div className={register.Login}>
                <img src={require('./Style/Images/EduHub.png')}  className={register.image} alt=""/>
                <RegisterForm  user={user} onClick={changeUser} 
                nameChange={nameChange} emailChange={emailChange} 
                passwordChange={passwordChange} onSubmit={addStudent}/>
            </div>
        </div>
    )
}

export default Register