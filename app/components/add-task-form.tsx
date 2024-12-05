import { gql, request } from "graphql-request";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

interface Props {
  initTask: () => void,
  openModal: boolean,
  setOpenModal: Dispatch<SetStateAction<boolean>>
}

export function AddTask(props: Props) {
  const [priority, setPriority] = useState("normal");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function closeModal() {
    console.log('close modal')
    props.setOpenModal(!props.openModal)
    setPriority("normal")
    setName("")
    setDescription("")
  }

  function closeModalCondition(e: React.MouseEvent) {
    e.stopPropagation()
  }

  async function onSave() {
    if(!priority || !name || !description) {
      return
    }
    
    const document = gql`
    mutation InsertTask($priority: String!, $name: String!, $description: String!, $user_id: Int, $status: String!) {
      insert_task_one(object: {priority: $priority, name: $name, description: $description, user_id: $user_id, status: $status}){
        priority,
        name,
        description,
        user_id,
        status
      }
    }
   `
    const variable = {
      "priority": priority,
      "name": name,
      "description": description,
      "user_id": 3,
      "status": "not done"
    }

    try {
      await request("http://localhost:8080/v1/graphql", document, variable)
    } catch (error) {
      return error
    }

    setPriority("normal")
    setName("")
    setDescription("")

    closeModal()
    props.initTask()
  }

  if (props.openModal) {
    return (
      <div onClick={closeModal} className='fixed top-0 w-full h-full bg-gray-300 bg-opacity-60 flex justify-center items-center'>
        <div onClick={closeModalCondition} className="main-card flex flex-col self-center opacity-90">
          <p className="self-center text-2xl font-bold pb-4">ADD TASK</p>
          <hr />
          <div className="p-4">
            <p className="font-bold pb-2">PRIORITY :</p>
            <select className="p-2 bg-white border border-gray-200 rounded-md shadow w-1/2" value={priority} onChange={(event => {
              setPriority(event.target.value)
            })}>
              <option value="high">HIGH</option>
              <option value="normal">NORMAL</option>
            </select>
          </div>
          <div className="p-4">
            <p className="font-bold pb-2">TASK NAME :</p>
            <input type="text" className="p-2 border border-gray-200 rounded-md shadow w-full" value={name} onChange={(event => {
              setName(event.target.value)
            })} />
          </div>
          <div className="p-4">
            <p className="font-bold pb-2">TASK DESCRIPTION :</p>
            <input type="text" className="p-2 border border-gray-200 rounded-md shadow w-full" value={description} onChange={(event => {
              setDescription(event.target.value)
            })} />
          </div>
          <div className="p-8 flex justify-center gap-10 h-28">
            <button onClick={onSave} className="bg-blue-500 hover:bg-blue-400 text-white border border-gray-200 rounded-md shadow w-1/2">SAVE</button>
            <button onClick={closeModal} className="bg-red-500 hover:bg-red-400 text-white border border-gray-200 rounded-md shadow w-1/2">CANCLE</button>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}