import { useState, useEffect } from "react"
import TaskItem from "../../components/TaskItem/TaskItem"

interface Task {
  title :string
  done :boolean
}

export default function Tasks() {
  // O userState vai acumular tarefas em um array.
  const [tasks, setTasks] = useState<Task[]>([])

  function addTask() {
    setTasks([
      ...tasks,
      {
        title: "tarefa 2",
        done: false
      }
    ])
  }

  function finishTask(position :number) {
    // Desta forma vai criar uma referência e não uma nova lista
    // const newList = tasks

    // Desta forma vai criar uma nova lista.
    const newList = [...tasks]

    newList[position].done = true

    setTasks(newList)
  }

  // Fica observando alterações.
  // Recebe dois parâmetros, a função a ser executada e
  // um array de observação. Quando vazio acontecerá no 
  // carregar da página.
  // Pode-se passar uma variável que quando alterada dispara a
  // função do useEffect.
  useEffect(() => {
    alert("Houve uma alteração")
  }, [tasks])

  return (
    <main className="container">
      <h1>Suas tarefas</h1>
      <div id="new-task">
        <button
          id="btnAdd"
          className="btn btn-primary"
          onClick={addTask}
        >
          Adicionar
        </button>
      </div>
      <div>
        {
          // Map - Quebra os itens de um array.
          tasks.map((task :Task, position :number) => {
            return (
              <TaskItem
                title = {task.title}
                done = {task.done}
                finishTask = {() => finishTask(position)}
              />
            )
          })
        }
      </div>
    </main>
  )
}