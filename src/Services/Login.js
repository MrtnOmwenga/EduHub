import axios from 'axios';

const BaseUrl = '/services/login';

const Login = async (credentials) => {
  const response = await axios.post(BaseUrl, credentials);
  return response.data;
};

export default { Login };
