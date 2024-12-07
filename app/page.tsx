'use client'

import { DoneTaskCard } from "./components/done-task-card";
import { TaskCard } from "./components/task-card";
import { AddTask } from "./components/add-task-form";
import { createContext, useEffect, useState } from "react";
import { gql, request } from 'graphql-request'
import moment from "moment";
import Link from "next/link";

export const TaskContext = createContext(null)

async function getTaskData() {
  const document = gql`
    {
      task(where: {status: {_nilike: "inactive"}, user_id: {_eq: 1}}, order_by: {priority: asc, id: asc}) {
        id
        name
        priority
        description
        user_id
        status
      }
    }
  `
  const result = await request('http://localhost:8080/v1/graphql', document)
  return result.task
}

function formatDateTime(how: string) {
  var result = ""
  if (how == "dateNumber") {
    result = moment().format("LLLL").split(",")[1].split(" ")[2]
  } else if (how == "dateName") {
    result = moment().format("LLLL").split(",")[0]
  } else if (how == "month") {
    result = moment().format("LLLL").split(",")[1].split(" ")[1]
  } else if (how == "year") {
    result = moment().format("LLLL").split(",")[2].split(" ")[1]
  }

  return result
}

export default function Home() {
  const [openModal, setOpenModal] = useState(false)
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState({ id: "", priority: "", name: "", description: "" })

  function addNewTask() {
    console.log('add new task')
    setOpenModal(!openModal)
    setTask({ id: "", priority: "normal", name: "", description: "" })
  }

  const initTask = async () => {
    try {
      const result = await getTaskData();
      setTasks(result)
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    initTask();
  }, [])

  return (
    <main className={`flex flex-col items-center p-8 ${tasks.length > 3 ? 'h-auto' : 'h-screen'} bg-gradient-to-r from-orange-100 to-orange-50`}>
      <div className="flex justify-between w-5/12 m-4 bg-white p-5 rounded-lg bg-opacity-70 shadow">
        <div className="text-xl font-bold">Welcome, Nitikron</div>
        <Link href={'/login'} className="bg-gray-400 hover:bg-gray-300 border border-gray-200 rounded-md shadow h-10 p-4 flex items-center self-center">Logout</Link>
      </div>
      <div className="main-card opacity-90 h-fit">
        <div className="flex justify-between pb-6">
          <div className="flex flex-row gap-3">
            <p className="text-5xl font-bold h-20 content-center">{formatDateTime("dateNumber")}</p>
            <div className="content-center">
              <p>{formatDateTime("dateName")}</p>
              <p>{formatDateTime("month")} {formatDateTime("year")}</p>
            </div>
          </div>
          <button onClick={addNewTask} className="grid grid-cols-3 self-center bg-gray-100 rounded shadow w-30 h-10 p-2">
            <div className="grid self-center justify-items-center content-center w-6 h-6 bg-teal-300 rounded-full border border-gray-200 shadow">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>
            </div>
            <p className="col-span-2 text-sm font-bold content-center">NEW TASK</p>
          </button>
        </div>
        <hr />
        <div className="grid justify-items-center gap-4 py-6">
          <p className="text-xl font-bold">TODO TASKS</p>
          {/* <div className="normal-task-card">
            <div className="flex justify-between">
              <div className="self-center">
                <p className="text-white font-bold">NORMAL PRIORITY</p>
                <p className="text-white text-2xl font-bold">Buy IPhone</p>
                <p className="text-white">go to IStudio</p>
              </div>
              <div className="self-center w-10 h-10 bg-white rounded-full border border-gray-200 shadow"></div>
            </div>
          </div>
          <div className="high-task-card">
            <div className="flex justify-between">
              <div className="self-center">
                <p className="text-white font-bold">NORMAL PRIORITY</p>
                <p className="text-white text-2xl font-bold">Buy IPhone</p>
                <p className="text-white">go to IStudio</p>
              </div>
              <div className="self-center w-10 h-10 bg-white rounded-full border border-gray-200 shadow"></div>
            </div>
          </div> */}
          {tasks.filter((itemFilter) => itemFilter.status != "done").map((item) => (
            <TaskCard key={item.id} taskData={item} initTask={initTask} setOpenModal={setOpenModal} setTask={setTask} />
          ))}
        </div>
        <hr />
        <div className="grid justify-items-center gap-4 pt-6">
          <p className="text-xl font-bold">DONE TASKS</p>
          {/* <div className="done-task-card">
            <div className="flex justify-between">
              <div className="self-center">
                <p className="text-white font-bold">NORMAL PRIORITY</p>
                <p className="text-white text-2xl font-bold">Buy IPhone</p>
                <p className="text-white">go to IStudio</p>
              </div>
              <button className="flex justify-center self-center w-10 h-10 bg-white rounded-full border border-gray-200 shadow">
                <div className="w-2/3 h-2/3 bg-lime-500 self-center rounded-full"></div>
              </button>
            </div>
          </div> */}
          {tasks.filter((itemFilter) => itemFilter.status == "done").map((item) => (
            <DoneTaskCard key={item.id} taskData={item} initTask={initTask} setOpenModal={setOpenModal} setTask={setTask} />
          ))}
        </div>
      </div>
      <TaskContext.Provider value={{ task, setTask }}>
        <AddTask setOpenModal={setOpenModal} openModal={openModal} initTask={initTask} tasks={tasks[0]} />
      </TaskContext.Provider>
    </main>
  );
}
