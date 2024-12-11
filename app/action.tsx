'use server'

import { gql, request } from 'graphql-request'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function HomeAction() {
  const secret = 'harmonyx'
  var cookieStore = await cookies();
  const token = cookieStore.get('token')?.value
  const identityData = jwt.verify(token, secret)
  var tasks

  const document = gql`
    {
      tasks(where: {status: {_nilike: "inactive"}, user_id: {_eq: ${identityData.id}}}, order_by: {priority: asc, id: asc}) {
        id
        name
        priority
        description
        user_id
        status
      }
    }
  `
  try {
    tasks = await request('http://3.27.122.22:8080/v1/graphql', document)
  } catch (error) {
    return error
  }

  return { tasks: tasks.tasks, userData: { id: identityData.id, firstname: identityData.firstname, lastname: identityData.lastname } }
}

export async function Logout() {
  (await cookies()).delete('token')
}