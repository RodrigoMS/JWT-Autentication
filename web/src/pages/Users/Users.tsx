import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listUsers } from "../../services/MainApi/users";
import { RootStore } from "../../store";
//import { addUser } from "../../store/modules/user/storeUser";

//const dispatch = useDispatch()

interface User {
  id: string;
  name: string;
  email: string;
}

// Exemplo de local storage assíncrono.
const asyncLocalStorage = {
  setItem: async (key: string, value: string) => {
    await Promise.resolve();
    localStorage.setItem(key, value);
  },

  getItem: async (key: string) => {
    await Promise.resolve();
    return localStorage.getItem(key);
  }
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  // A partir do store do Redux, obter os dados do usuário logado.
  // Pode-se obter o reducer inteiro ou a partir de uma função retornar apenas
  // uma parte do estado que se precisa. No caso está obtendo apenas a parte userReduce.
  let userLogIn = useSelector((store: RootStore) => store.userReduce);

  useEffect(() => {
    const getData = async () => {
      try {
        // O usuário não esta logado ou não tem um token sai da função.
        if (!userLogIn.isLogged || !userLogIn.token) {
          const bearer: string = JSON.stringify(localStorage.getItem("Bearer")).replaceAll(`\"`, ``)
          const email: string = JSON.stringify(localStorage.getItem("email")).replaceAll(`\"`, ``)

          if (bearer === null) {
            // Aqui tem que voltar para a tela de login.
            console.log("opa")
          }

          
          // Faz a troca dos dados do usuário
          // no store do redux.
          // Para ver os dados no navegador utilize a extensão
          // para o navegador - Redux dev tools.
          /*dispatch(addUser({
            token: bearer,
            email: email
          }))*/

          userLogIn = {
            isLogged: true,
            token: bearer,
            email: email
          }

          //userLogIn = useSelector((store: RootStore) => store.userReduce);

          console.log(userLogIn)

          return
        }
        // Passa o token para a função que chama a API para verificar se
        // existe um usuário conectado. Pois é uma rota autenticada.
        // retornando os usuários cadastrados no banco de dados da API.
        const response = await listUsers(userLogIn.token)
        //const response = await listUsers("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJybXNAbG9jYWxob3N0LmNvbSIsImlhdCI6MTY2NzgzMTE1OX0.k5L6A92T98cqZip6qeua1LJMToIQ-R0B8JjCl7crw2I")

        setUsers(response.data)

      } catch (error) {
        alert("Deu algo errado")
      }
    };

    getData()
  }, [setUsers])

  return (
    <main>
      <h1>Lista de Usuários</h1>
      <p>O email do usuário logado é: {userLogIn.email}</p>
      <ul>
        {users.map((user) => (
          <div key={user.id}>
            <li>{user.name}</li>
            <li>{user.email}</li>
          </div>
        ))}
      </ul>
    </main>
  )
}