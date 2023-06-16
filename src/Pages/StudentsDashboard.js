import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import dash from './Style/Dashboard.module.css'
import database from './Services/database'
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const StudentsDashboard = () => {
    const location = useLocation()
    const data = location.state.user
    const [user, setUser] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        database.getOne(data.id, 'student').then((response) => {
            setUser(response)
        })
    }, [])

    const viewCourse = (id) => {
        navigate('/coursepage', {replace: true, state: {id : id}})
    }

    return (
        <div className={dash.outer_container}>
            <div className={dash.menu}>
                <h3 className={dash.title}>HUB <br/> EDUCATION</h3>
                <ul className={dash.menu_list}>
                    <li className={dash.menu_item}>DASHBOARD</li>
                    <Link to={'/courses'} className={dash.link}><li className={dash.menu_item}> COURSES </li></Link>
                    <li className={dash.menu_item}>QUIZZES</li>
                    <li className={dash.menu_item}>INSTRUCTORS</li>
                    <li className={dash.menu_item}>ACCOUNT</li>
                </ul>
            </div>
            <div className={dash.content}>
                <h2 className={dash.main_title}>Welcome {user.name}</h2>
                <table className={dash.course_list}>
                    <thead className={dash.table_head}>
                        <th> COURSE NAME</th>
                        <th> GRADE</th>
                        <th>  </th>
                    </thead>
                    <tbody>
                    {user.courses?.map(course => {
                        return (
                            <tr className={dash.course_element} key={course.id}>
                                <th className={dash.course_name}>{course.name}</th>
                                <th className={dash.course_grade}>{course.grade}</th>
                                <th className={dash.course_button}>
                                    <button className={dash.course_btn} onClick={() => viewCourse(course.id)}> Study <FaArrowRight className={dash.course_txt}/> </button>
                                </th>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentsDashboard