'use client'

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { LoginAction } from "./action";

export default function Login() {
  const initState = {
    status: false,
    message: ''
  }
  const [state, formAction] = useActionState(LoginAction, initState)

  return (
    <div className="flex h-screen p-8 pr-32 gap-8 bg-gradient-to-r from-orange-100 to-orange-50">
      <div className="flex flex-col self-center items-center w-3/5 gap-8 p-8">
        <p className="text-6xl font-bold h-2/3">WELCOME, PLEASE LOGIN</p>
        <Image
          src="/assets/task.png"
          alt="task logo"
          width={640}
          height={360}
        />
      </div>
      <div className="main-card flex justify-center flex-col self-center opacity-90">
        <p className="self-center text-2xl font-bold pb-4">LOGIN</p>
        <hr />
        <form action={formAction}>
          <div className="p-4">
            <p className="font-bold pb-2">USERNAME :</p>
            <input type="text" className="p-2 border border-gray-200 rounded-md shadow w-full" name="username" defaultValue={(state.payload?.get('username') || '') as string} />
          </div>
          <div className="p-4">
            <p className="font-bold pb-2">PASSWORD :</p>
            <input type="password" className="p-2 border border-gray-200 rounded-md shadow w-full" name="password" defaultValue={(state.payload?.get('password') || '') as string} />
          </div>
          <div className="p-8 flex justify-center gap-10 h-28">
            <button className="bg-blue-500 hover:bg-blue-400 text-white border border-gray-200 rounded-md shadow w-1/2">LOGIN</button>
            <Link href={"/register"} className="flex justify-center items-center bg-blue-500 hover:bg-blue-400 text-white border border-gray-200 rounded-md shadow w-1/2">REGISTER</Link>
          </div>
        </form>
        {state?.message &&
          <div className='items-center self-center text-red-600'>{state.message}</div>
        }
      </div>
    </div>
  )
}