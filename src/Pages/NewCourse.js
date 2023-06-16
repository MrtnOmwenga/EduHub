import newCourse from './Style/NewCourse.module.css'
import database from './Services/database'
import { useState, useEffect } from 'react'
import Session from './Services/Session'
import { Link, useNavigate } from 'react-router-dom'

const NewCourse = () => {
    const [moduleCount, setModuleCount] = useState(1)
    const [courseName, setCourseName] = useState('')
    const [modules, setModules] = useState([])
    const [moduleName, setModuleName] = useState('')
    const [file, setFile] = useState('')
    const [courses, setCourses] = useState([])
    const [instructor, setInstructor] = useState('')
    const navigate = useNavigate()
    const user = {name: Session.getName(), id: Session.getId()}

    useEffect(() => {
        database.getCourses().then((course) => {
            setCourses(courses.concat(course))
        })

        database.getOne(user.id, 'Instructor').then(instructor => {
            setInstructor(instructor)
        })
    }, [])

    const moduleChange = (event) => {
        setModuleName(event.target.value)
    }

    const fileChange = (event) => {
        setFile(event.target.value)
    }

    const addModule =(event) => {
        const newObject = {
            name: moduleName,
            file: file
        }
        setModules(modules.concat(newObject))
        setModuleName('')
        setFile('')

        setModuleCount(moduleCount + 1)
    }

    var content = []
    for (let count=0; count < moduleCount; count++) {
        content.push(<div className={newCourse.module_element}>
                <input key={'module'+count} className={newCourse.module_name} type='text' onChange={moduleChange} placeholder='Module name'/>
                <input key={'file'+count} className={newCourse.module_link} type='text' onChange={fileChange} placeholder='Paste document Link'/>
            </div>)
    }

    const courseChange = (event) => {
        setCourseName(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(courseName)
        console.log(modules)
        const newObject = {
            name: courseName,
            id: courses.length + 1,
            instructor: user.name,
            modules: []
        }

        modules.map(module => {
            newObject.modules.push({
                name: module.name,
                file: module.file
            })
        })

        const newInstructor = {...instructor, courses: instructor.courses.concat({
            name: courseName,
            id: courses.length + 1,
            students: 0
        })}

        database.addCourse(newObject).then(response => {
            setCourses(courses.concat(response))
        })
        database.updateInstructor(user.id, newInstructor)
        navigate('/instructorsdashboard', {replace: true, state: {user}})
    }

    return (
        <div className={newCourse.body}>
            <Link to={'/instructorsdashboard'} state={{user}} className={newCourse.back}>
                <p className={newCourse.back}> Back </p>
            </Link>
            <form className={newCourse.form} onSubmit={handleSubmit}>
                <h3 className={newCourse.title}> Create Course </h3>
                <input className={newCourse.course_name} type='text' placeholder='Course Name' onChange={courseChange}/>
                {content.map(content => content)}
                <button className={newCourse.add_module} onClick={addModule}> Add Module </button>
                <div>
                    <button className={newCourse.submit} type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default NewCourse