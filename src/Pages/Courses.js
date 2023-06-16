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
    const navigate = useNavigate()

    useEffect(() => {
        database.getCourses().then((course) => {
            setCourse(courses.concat(course))
        })
    }, [])

    const searchFilter = (event) => {
        setFilter(event.target.value)
    }

    const viewCourse = (id) => {
        navigate('/coursepage', {replace: true, state: {id : id}})
    }

    const filteredData = courses.filter((course) => course.name.toLowerCase() === filter.toLowerCase())
    const coursesFiltered = filteredData.length === 0 ? courses : filteredData

    const user = {name: Session.getName(), id: Session.getId()}

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
                            <button className={courseStyle.enroll_button} onClick={() => viewCourse(course.id)}> {buttonText} <FaArrowRight className={courseStyle.course_icon}/></button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Courses