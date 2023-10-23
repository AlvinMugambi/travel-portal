import axios from 'axios';
const BASE_URL = 'https://nairobiservices.go.ke/api/travel';
// const BASE_URL = 'http://127.0.0.1:8400';

const register = async (email, firstname, surname, phone_number, password) => {
  return axios
    .post(`${BASE_URL}/auth/register`, {
      email,
      firstname,
      surname,
      phone_number,
      password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('registration error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const login = async (username, password) => {
  return axios
    .post(`${BASE_URL}/auth/login`, {
      username,
      password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('registration error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

const getUsers = async (username, password) => {
  return axios
    .get(`${BASE_URL}/auth/users`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('getUsers error =>', error?.response);
      return {
        success: false,
        error: error,
      };
    });
};

export const authService = {
  register,
  login,
  getUsers,
};
