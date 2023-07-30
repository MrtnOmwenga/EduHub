import axios from 'axios';

const Register = async (credentials, UserType) => {
  const BaseUrl = UserType === 'Student' ? '/api/students' : '/api/intructors';

  const response = await axios.post(BaseUrl, credentials);
  return response.data;
};

export default { Register };
