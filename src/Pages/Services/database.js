import axios from 'axios';

const baseUrl = 'https://hubeducation-json-server.onrender.com'; // 'http://localhost:3001';
const uploadUrl = 'https://hubeducation-express-server.onrender.com'; // 'http://localhost:8000';

const getAll = (user) => {
  const res = axios.get(`${baseUrl}/${user.toLowerCase()}`);
  return res.then((response) => response.data);
};

const getOne = (id, user) => {
  const res = axios.get(`${baseUrl}/${user.toLowerCase()}/${id}`);
  return res.then((response) => response.data);
};

const addPerson = (newObject, user) => {
  const res = axios.post(`${baseUrl}/${user.toLowerCase()}`, newObject);
  return res.then((response) => response.data);
};

const addCourse = (newObject) => {
  const res = axios.post(`${baseUrl}/courses`, newObject);
  return res.then((response) => response.data);
};

const deletePerson = (id) => {
  axios.delete(`${baseUrl}/${id}`);
};

const updatePerson = (id, newObject) => {
  const res = axios.put(`${baseUrl}/student/${id}`, newObject);
  return res.then((response) => response.data);
};

const updateInstructor = (id, newObject) => {
  const res = axios.put(`${baseUrl}/instructor/${id}`, newObject);
  return res.then((response) => response.data);
};

const getCourses = () => {
  const res = axios.get(`${baseUrl}/courses`);
  return res.then((response) => response.data);
};

const saveFile = (data) => {
  const res = axios.post(`${uploadUrl}/upload`, data);
  return res;
};

const database = {
  getAll,
  addPerson,
  deletePerson,
  updatePerson,
  getOne,
  getCourses,
  addCourse,
  updateInstructor,
  saveFile,
};
export default database;
