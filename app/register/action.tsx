'use server'

import { gql, request } from 'graphql-request'
const bcrypt = require('bcrypt');
const saltRounds = 10;

type ActionState = {
  status: boolean
  message: string;
  payload?: FormData;
};

export async function RegisterAction(prevState: ActionState, formData: FormData) {
  const firstname = formData.get('firstname')
  const lastname = formData.get('lastname')
  const username = formData.get('username')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  // for graphQL
  var document = ''
  var variable = {}

  async function checkUser() {
    var document = gql`
      {
        user(where: {username: {_eq: "${username}"}}) {
          id
        }
      }
    `
    const result = await request('http://localhost:8080/v1/graphql', document)
    return result.user.length
  }

  if (!firstname || !lastname || !username || !password || !confirmPassword) {
    return { status: false, message: 'Please complete all input!', payload: formData }
  }

  if (password !== confirmPassword) {
    return { status: false, message: 'Password is not match!', payload: formData }
  }

  var userLength = await checkUser()
  if (userLength > 0) {
    return { status: false, message: 'Username has already been taken!', payload: formData }
  }

  var passwordHash = await bcrypt.hash(password, saltRounds)

  document = gql`
      mutation InsertUser($firstname: String!, $lastname: String!, $username: String!, $password: String!) {
        insert_user_one(object: {firstname: $firstname, lastname: $lastname, username: $username, password: $password}){
          firstname,
          lastname,
          username,
          password
        }
      }
     `
  variable = {
    'firstname': firstname,
    'lastname': lastname,
    'username': username,
    'password': passwordHash
  }

  try {
    await request('http://localhost:8080/v1/graphql', document, variable)
  } catch (error) {
    return { status: false, message: `Error : ${error ? error : 'Somthing went wrong!'}`, payload: formData }
  }

  return { status: true, message: 'done' }
}