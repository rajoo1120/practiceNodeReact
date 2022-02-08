import Axios from 'axios';
//import { response } from 'express';
import {
  LOGIN_USER,
  REGISTER_USER
}from './types';

export function loginUser(dataTosubmit){
  const request = Axios.post('/api/users/login',dataTosubmit)
  .then(response => response.data)
  return {
    type:LOGIN_USER,
    payload: request
  }
}

export function registerUser(dataTosubmit){
  const request = Axios.post('/api/users/register',dataTosubmit)
  .then(response => response.data)

  return {
    type:REGISTER_USER,
    payload: request
  }
}