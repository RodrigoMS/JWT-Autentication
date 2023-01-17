import './task-item.css'

interface TaskItemProps {
  title :string
  done : boolean
  // Recebe uma função vazia.
  finishTask: () => void
}

export default function TaskItem(props: TaskItemProps) {
  /* Caso done for verdadeiro adiciona a classe CSS
     deixando o texto taxado. */
  return (
    <li className={`task-item ${props.done ? "done" : ""}`}>
      <span>&#10005;</span>
      <p>{props.title}</p>
      <span onClick={props.finishTask}>&#10003;</span>
    </li>
  )
}