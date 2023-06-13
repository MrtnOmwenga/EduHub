import axios from 'axios'
const baseUrl = 'http://localhost:3001/students'

const getAll = () => {
    const response = axios.get(baseUrl)
    return response.then(response => response.data)
}

const addPerson = (newObject) => {
    const response = axios.post(baseUrl, newObject)
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