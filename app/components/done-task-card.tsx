import { gql, request } from "graphql-request"
import { Dispatch, SetStateAction } from "react"

interface Props {
  initTask: () => void,
  taskData: {
    id: Number
    priority: String,
    name: String,
    description: String
  }
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setTask: Dispatch<SetStateAction<Props["taskData"]>>
}

export function DoneTaskCard(props: Props) {

  async function unDoneTask(e: React.MouseEvent, id: Number) {
    e.stopPropagation()
    console.log('undone task card')
    const document = gql`
      mutation Updte {
        update_task_by_pk (
          pk_columns: {id: ${id}}
          _set: { status: "not done" }
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
    <div onClick={editTask} className="done-task-card cursor-pointer">
      <div className="flex justify-between">
        <div className="self-center">
          <p className="text-white font-bold">{props.taskData.priority == "high" ? "HIGH" : "NORMAL"} PRIORITY</p>
          <p className="text-white text-2xl font-bold">{props.taskData.name}</p>
          <p className="text-white">{props.taskData.description}</p>
        </div>
        <button onClick={(e) => unDoneTask(e, props.taskData.id)} className="flex justify-center self-center w-10 h-10 bg-white rounded-full border border-gray-200 shadow">
          <div className="w-2/3 h-2/3 bg-lime-500 self-center rounded-full"></div>
        </button>
      </div>
    </div>
  )
}