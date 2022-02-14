import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://kesleydev-db.herokuapp.com',
});
