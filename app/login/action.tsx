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

  async function getUser() {
    var document = gql`
      {
        user(where: {username: {_eq: "${username}"}}) {
          id
          firstname
          lastname
          password
        }
      }
    `
    const result = await request('http://localhost:8080/v1/graphql', document)
    return result.user
  }

  if (!username || !password) {
    return { status: false, message: 'Please complete all input!', payload: formData }
  }

  var user = await getUser()
  if (user.length < 1) {
    return { status: false, message: 'The username or password is incorrect!', payload: formData }
  }

  var comparePassword = await bcrypt.compare(password, user[0].password)
  if (!comparePassword) {
    return { status: false, message: 'The username or password is incorrect!', payload: formData }
  }

  const secret = 'harmonyx'
  const token = jwt.sign({ id: user[0].id, firstname: user[0].firstname, lastname: user[0].lastname }, secret, { expiresIn: '1h' })
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    maxAge: 300000
  })
  redirect('/')
}