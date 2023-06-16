import { useEffect, useState } from 'react'
import courseStyle from './Style/Courses.module.css'
import database from './Services/database'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Session from './Services/Session'
import { useNavigate } from 'react-router-dom'

const Courses = () => {
    const [courses, setCourse] = useState([])
    const [filter, setFilter] = useState('')
    const [student, setStudent] = useState('')
    const navigate = useNavigate()
    const user = {name: Session.getName(), id: Session.getId()}

    useEffect((courses) => {
        database.getCourses().then((course) => {
            setCourse(course)
        })

        database.getOne(user.id, 'Student').then(student => {
            setStudent(student)
        })
    }, [user.id])

    const searchFilter = (event) => {
        setFilter(event.target.value)
    }

    const viewCourse = (course) => {
        if (Session.getUser() === 'Student') {
            const exists = student.courses.filter(enrolled_course => enrolled_course.id === course.id)
            if (exists === undefined) {
                const newStudent = {...student, courses: student.courses.concat({
                    name: course.name,
                    id: course.id,
                    grade: 0
                })}

                database.updatePerson(user.id, newStudent)
            }else {
                alert ("You are already enrolled to this course")
            }
        }
        navigate('/coursepage', {replace: true, state: {id : course.id}})
    }

    const filteredData = courses.filter((course) => course.name.toLowerCase() === filter.toLowerCase())
    const coursesFiltered = filteredData.length === 0 ? courses : filteredData

    let baseUrl = Session.getUser() === 'Student' ? '/studentsdashboard' : '/instructorsdashboard'
    let buttonText = Session.getUser() === 'Student' ? 'Enroll' : 'View'

    return (
        <div className={courseStyle.outer_container}>
            <Link to={baseUrl} state={{user}} className={courseStyle.back}>
                <p className={courseStyle.back}> Back </p>
            </Link>
            <h3 className={courseStyle.title}>All courses</h3>
            <input className={courseStyle.filter} placeholder='Search' onChange={searchFilter} value={filter}/>
            <ul className={courseStyle.course_list}>
                {coursesFiltered?.map(course => {
                    return (
                        <li className={courseStyle.course_element} key={course.id}>
                            <div className={courseStyle.course_info}>
                                <h4 className={courseStyle.course_name}>{course.name} </h4>
                                <p className={courseStyle.course_instructor}> {course.instructor} </p>
                            </div>
                            <button className={courseStyle.enroll_button} onClick={() => viewCourse(course)}> {buttonText} <FaArrowRight className={courseStyle.course_icon}/></button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Courses