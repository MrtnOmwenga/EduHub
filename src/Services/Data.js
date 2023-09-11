import axios from 'axios';

let token = null;

const SetToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const GetUser = async (id, UserType) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.get(`/api/${UserType}/${id}`, config)
    .catch((error) => {
      throw new Error(error.response.data);
    });
  return response.data;
};

const UpdateUser = async (id, UserType, NewObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`/api/${UserType}/${id}`, NewObject, config)
    .catch((error) => {
      throw new Error(error.response.data);
    });
  return response.data;
};

const GetCourse = async (id) => {
  const response = await axios.get(`/api/courses/${id}`)
    .catch((error) => {
      throw new Error(error.response.data);
    });
  return response.data;
};

const GetAllCourses = async () => {
  const response = await axios.get('/api/courses')
    .catch((error) => {
      throw new Error(error.response.data);
    });
  return response.data;
};

const SaveFile = async (data) => {
  const res = await axios.post('/resources/files', data)
    .catch((error) => {
      throw new Error(error.response.data);
    });
  return res;
};

const CreateCourse = async (NewCourseObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post('/api/courses', NewCourseObject, config)
    .catch((error) => {
      throw new Error(error.response.data);
    });
  return response.data;
};

export default {
  GetUser, GetCourse, GetAllCourses, UpdateUser, SaveFile, CreateCourse, SetToken,
};
