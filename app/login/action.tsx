'use server'

import { gql, request } from 'graphql-request'
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
const bcrypt = require('bcrypt');

type ActionState = {
  status: boolean
  message: string;
  payload?: FormData;
};

export async function LoginAction(prevState: ActionState, formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  // for graphQL
  var document = ''
  var variable = {}

  async function getUsers() {
    var document = gql`
      {
        users(where: {username: {_eq: "${username}"}}) {
          id
          firstname
          lastname
          password
        }
      }
    `
    const result = await request('http://3.27.122.22:8080/v1/graphql', document)
    return result.users
  }

  if (!username || !password) {
    return { status: false, message: 'Please complete all input!', payload: formData }
  }

  var users = await getUsers()
  if (users.length < 1) {
    return { status: false, message: 'The username or password is incorrect!', payload: formData }
  }

  var comparePassword = await bcrypt.compare(password, users[0].password)
  if (!comparePassword) {
    return { status: false, message: 'The username or password is incorrect!', payload: formData }
  }

  const secret = 'harmonyx'
  const token = jwt.sign({ id: users[0].id, firstname: users[0].firstname, lastname: users[0].lastname }, secret, { expiresIn: '1h' })
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    maxAge: 300000
  })
  redirect('/')
}