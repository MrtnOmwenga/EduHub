import axios from 'axios'
const baseUrl = 'http://localhost:3001'

const getAll = (user) => {
    const response = axios.get(`${baseUrl}/${user.toLowerCase()}`)
    return response.then(response => response.data)
}

const addPerson = (newObject, user) => {
    const response = axios.post(`${baseUrl}/${user.toLowerCase()}`, newObject)
    return response.then(response => response.data)
}

const deletePerson = (id) => {
    axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = (id, newObject) => {
    const response = axios.put(`${baseUrl}/${id}`, newObject)
    return response.then(response => response.data)
}

const database = {getAll, addPerson, deletePerson, updatePerson}
export default database