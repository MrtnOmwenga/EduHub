import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import courseStyle from './Style/Courses.module.css'
import database from './Services/database'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Session from './Services/Session'

const CoursePage = () => {
    const [courses, setCourse] = useState()
    const [filter, setFilter] = useState('')
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        database.getOne(location.state.id, 'courses').then((course) => {
            setCourse(course)
        }).catch((err) => {
            navigate('/errorpage')
        })
    }, [location.state.id, navigate])

    const searchFilter = (event) => {
        setFilter(event.target.value)
    }

    const filteredData = courses?.modules.filter((module) => module.name.toLowerCase() === filter.toLowerCase())
    const coursesFiltered = filteredData?.length === 0 ? courses?.modules : filteredData

    const user = {name: Session.getName(), id: Session.getId()}

    let baseUrl = Session.getUser() === 'Student' ? '/studentsdashboard' : '/instructorsdashboard'

    return (
        <div className={courseStyle.outer_container}>
            <Link to={baseUrl} state={{user}} className={courseStyle.back}>
                <p className={courseStyle.back}> Back </p>
            </Link>
            <h3 className={courseStyle.title}>All Modules</h3>
            <input className={courseStyle.filter} placeholder='Search' onChange={searchFilter} value={filter}/>
            <ul className={courseStyle.course_list}>
                {coursesFiltered?.map(course => {
                    return (
                        <li className={courseStyle.course_element} key={course.id}>
                            <div className={courseStyle.course_info}>
                                <h4 className={courseStyle.course_name}>{course.name} </h4>
                                <p className={courseStyle.course_instructor}> {course.file} </p>
                            </div>
                            <button className={courseStyle.enroll_button}> View <FaArrowRight className={courseStyle.course_icon}/></button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default CoursePage