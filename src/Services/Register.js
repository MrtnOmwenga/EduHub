import axios from 'axios';

const Register = async (credentials, UserType) => {
  const BaseUrl = UserType === 'Student' ? '/api/students' : '/api/instructors';

  const response = await axios.post(BaseUrl, credentials)
    .catch((error) => {
      throw new Error(error.response.data);
    });
  return response.data;
};

export default { Register };
