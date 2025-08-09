import axios from 'axios';

const baseURL = 'https://api.github.com';

const instance = axios.create({
  baseURL,
  timeout: 30000,
});

const defaultHeaders = {
  'Content-Type': 'application/json',
};

instance.defaults.headers.common = defaultHeaders;

export default instance;
