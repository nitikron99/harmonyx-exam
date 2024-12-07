'use client'
import Link from "next/link";
import { useActionState } from "react";
import { RegisterAction } from "./action";

export default function Register() {
  const initState = {
    status: false,
    message: ''
  }
  const [state, formAction] = useActionState(RegisterAction, initState)

  return (
    <div className="grid justify-items-center h-screen bg-gradient-to-r from-orange-100 to-orange-50">
      <div className="main-card flex flex-col self-center opacity-90">
        <p className="self-center text-2xl font-bold pb-4">REGISTER</p>
        <hr />
        <form action={formAction}>
          <div className="p-4">
            <p className="font-bold pb-2">FIRSTNAME :</p>
            <input type="text" className="p-2 border border-gray-200 rounded-md shadow w-full" name="firstname" defaultValue={(state.payload?.get("firstname") || "") as string} />
          </div>
          <div className="p-4">
            <p className="font-bold pb-2">LASTNAME :</p>
            <input type="text" className="p-2 border border-gray-200 rounded-md shadow w-full" name="lastname" defaultValue={(state.payload?.get("lastname") || "") as string} />
          </div>
          <div className="p-4">
            <p className="font-bold pb-2">USERNAME :</p>
            <input type="text" className="p-2 border border-gray-200 rounded-md shadow w-full" name="username" defaultValue={(state.payload?.get("username") || "") as string} />
          </div>
          <div className="p-4">
            <p className="font-bold pb-2">PASSWORD :</p>
            <input type="password" className="p-2 border border-gray-200 rounded-md shadow w-full" name="password" defaultValue={(state.payload?.get("password") || "") as string} />
          </div>
          <div className="p-4">
            <p className="font-bold pb-2">CONFIRM PASSWORD :</p>
            <input type="password" className="p-2 border border-gray-200 rounded-md shadow w-full" name="confirmPassword" defaultValue={(state.payload?.get("confirmPassword") || "") as string} />
          </div>
          <div className="p-8 flex justify-center gap-10 h-28">
            <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white border border-gray-200 rounded-md shadow w-1/2">SUBMIT</button>
            <Link href={"/login"} className="flex justify-center items-center bg-gray-500 hover:bg-gray-400 text-white border border-gray-200 rounded-md shadow w-1/2">BACK</Link>
          </div>
        </form>
        {state?.message &&
          <div className={`items-center self-center ${state?.status ? "text-green-600" : "text-red-600"}`}>{state?.message == 'done' ? <p>Register successfully, go to <Link href={'/login'} className="text-xl text-blue-600 hover:underline">Login</Link> page.</p> : `${state.message}`}</div>
        }
      </div>
    </div>
  )
}