import axios from 'axios'
const baseUrl = 'http://localhost:3001'

const getAll = (user) => {
    const response = axios.get(`${baseUrl}/${user.toLowerCase()}`)
    return response.then(response => response.data)
}

const getOne = (id, user) => {
    const response = axios.get(`${baseUrl}/${user.toLowerCase()}/${id}`)
    return response.then(response => response.data)
}

const addPerson = (newObject, user) => {
    const response = axios.post(`${baseUrl}/${user.toLowerCase()}`, newObject)
    return response.then(response => response.data)
}

const addCourse = (newObject) => {
    const response = axios.post(`${baseUrl}/courses`, newObject)
    return response.then(response => response.data)
}

const deletePerson = (id) => {
    axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = (id, newObject) => {
    const response = axios.put(`${baseUrl}/student/${id}`, newObject)
    return response.then(response => response.data)
}

const updateInstructor = (id, newObject) => {
    const response = axios.put(`${baseUrl}/instructor/${id}`, newObject)
    return response.then(response => response.data)
}

const getCourses = () => {
    const response = axios.get(`${baseUrl}/courses`)
    return response.then(response => response.data)
}

const database = {getAll, addPerson, deletePerson, 
    updatePerson, getOne, getCourses, addCourse,
    updateInstructor
}
export default database