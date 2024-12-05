export default function Register() {
  return (
    <div className="grid justify-items-center h-screen bg-gradient-to-r from-orange-100 to-orange-50">
      <div className="main-card flex flex-col self-center opacity-90">
        <p className="self-center text-2xl font-bold pb-4">REGISTER</p>
        <hr />
        <div className="p-4">
          <p className="font-bold pb-2">USERNAME :</p>
          <input type="text" className="p-2 border border-gray-200 rounded-md shadow w-full" />
        </div>
        <div className="p-4">
          <p className="font-bold pb-2">PASSWORD :</p>
          <input type="password" className="p-2 border border-gray-200 rounded-md shadow w-full" />
        </div>
        <div className="p-4">
          <p className="font-bold pb-2">CONFIRM PASSWORD :</p>
          <input type="password" className="p-2 border border-gray-200 rounded-md shadow w-full" />
        </div>
        <div className="p-8 flex justify-center gap-10 h-28">
          <button className="bg-blue-500 hover:bg-blue-400 text-white border border-gray-200 rounded-md shadow w-1/2">SUBMIT</button>
          <button className="bg-gray-500 hover:bg-gray-400 text-white border border-gray-200 rounded-md shadow w-1/2">BACK</button>
        </div>
      </div>
    </div>
  )
}