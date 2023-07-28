import axios from 'axios';

const GetUser = async (id, UserType) => {
  const response = await axios.get(`/api/${UserType}/${id}`);
  return response.data;
};

const UpdateUser = async (id, UserType, NewObject) => {
  const response = await axios.put(`/api/${UserType}/${id}`, NewObject);
  return response.data;
};

const GetCourse = async (id) => {
  const response = await axios.get(`/api/courses/${id}`);
  return response.data;
};

const GetAllCourses = async () => {
  const response = await axios.get('/api/courses');
  return response.data;
};

export default {
  GetUser, GetCourse, GetAllCourses, UpdateUser,
};
