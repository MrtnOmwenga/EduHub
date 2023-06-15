import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import dash from './Style/Dashboard.module.css'
import database from './Services/database'

const Dashboard = () => {
    const location = useLocation()
    const data = location.state.user
    const [user, setUser] = useState({})

    useEffect(() => {
        database.getOne(data.id, location.state.capacity).then((response) => {
            setUser(response)
        })
    }, [])
    console.log(user.courses)
    /*user.courses.map(course => {
        console.log(course.name)
    })*/

    return (
        <div className={dash.outer_container}>
            <div className={dash.menu}>
                <h2 className={dash.title}>HUB EDUCATION</h2>
                <ul className={dash.menu_list}>
                    <li className={dash.menu_item}>DASHBOARD</li>
                    <li className={dash.menu_item}>COURSES</li>
                    <li className={dash.menu_item}>QUIZZEZ</li>
                    <li className={dash.menu_item}>INSTRUCTORS</li>
                    <li className={dash.menu_item}>ACCOUNT</li>
                </ul>
            </div>
            <h3 className={dash.main_title}>Welcome {user.name}</h3>
            <ul className={dash.course_list}>
                {user.courses?.map(course => {
                    return (
                        <li className={dash.course_element} key={course.id}>
                            <p className={dash.course_name}>{course.name}</p>
                            <p className={dash.course_grade}>{course.grade}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Dashboard