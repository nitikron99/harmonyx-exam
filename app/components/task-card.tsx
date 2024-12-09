import { gql, request } from "graphql-request"
import { Dispatch, SetStateAction } from "react"

interface Props {
  initTask: () => void,
  taskData: {
    id: Number
    priority: String,
    name: String,
    description: String
  },
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setTask: Dispatch<SetStateAction<Props["taskData"]>>
}

export function TaskCard(props: Props) {

  async function doneTask(e: React.MouseEvent, id: Number) {
    e.stopPropagation()
    console.log('done task card')
    const document = gql`
      mutation Updte {
        update_tasks_by_pk (
          pk_columns: {id: ${id}}
          _set: { status: "done" }
        ) {
          id
          status
        }
      }
    `

    try {
      await request("http://localhost:8080/v1/graphql", document)
    } catch (error) {
      return error
    }

    props.initTask()
  }

  async function removeTask(e: React.MouseEvent, id: Number) {
    e.stopPropagation()
    console.log('done task card')
    const document = gql`
      mutation Updte {
        update_tasks_by_pk (
          pk_columns: {id: ${id}}
          _set: { status: "inactive" }
        ) {
          id
          status
        }
      }
    `

    try {
      await request("http://localhost:8080/v1/graphql", document)
    } catch (error) {
      return error
    }

    props.initTask()
  }

  function editTask() {
    props.setOpenModal(true)
    props.setTask(props.taskData)
  }

  return (
    <div onClick={editTask} className={`${props.taskData.priority == "high" ? "high-task-card" : "normal-task-card"} cursor-pointer`}>
      <div className="flex justify-between">
        <div className="flex flex-row">
          <button onClick={(e) => removeTask(e, props.taskData.id)} className="flex justify-center self-center items-center text-white bg-red-600 w-10 h-1/2 border border-gray-200 rounded-md shadow text-lg mr-6">X</button>
          <div className="self-center">
            <p className="text-white font-bold">{props.taskData.priority == "high" ? "HIGH" : "NORMAL"} PRIORITY</p>
            <p className="text-white text-2xl font-bold">{props.taskData.name}</p>
            <p className="text-white">{props.taskData.description}</p>
          </div>
        </div>
        <button onClick={(e) => doneTask(e, props.taskData.id)} className="self-center w-10 h-10 bg-white rounded-full border border-gray-200 shadow"></button>
      </div>
    </div>
  )
}