import { useState } from 'react';

// Hook - Dispara um ação do Redux.
import { useDispatch } from 'react-redux';
// Configuração do store Redux de usuários.
import { addUser } from '../../store/modules/user/storeUser';

import Link from '../../components/Link';

// Importação do estilo CSS
import './home.css'

// Importação de imagens OBS: As imagens são tratadas como componentes.
import BackgroundImage from '../../components/RocketSVG/RocketSVG'
import { login } from '../../services/MainApi/login';

// Envia o usuário para outra rota.
import { useNavigate } from "react-router-dom";

/*interface loginForm{
  email: string
  password: string
}*/

export const Home = () => {

  // useState - Retorna um Array.
  // Um estado sempre sobrescreve o anterior.
  // Quando se deseja acumular valores utilize ex: "[...email, email]".
  // OBS: Tudo o que estava anteriormente mais o novo.
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const dispatch = useDispatch()

  const navigate = useNavigate()

  // Exemplo de local storage assíncrono.
  const asyncLocalStorage = {
    setItem: async (key :string, value :string) => {
      await Promise.resolve();
      localStorage.setItem(key, value);
    },

    getItem: async (key :string) => {
      await Promise.resolve();
      return localStorage.getItem(key);
    }
  }


  //const [form, handleForm] = useState<loginForm>()

  async function getForm(event :React.FormEvent) {
    event.preventDefault()

    // Redux
    try {
      const response = await login({ email, password })

      // Faz a troca dos dados do usuário
      // no store do redux.
      // Para ver os dados no navegador utilize a extensão
      // para o navegador - Redux dev tools.
      dispatch(addUser({
        token: response.data,
        email
      }))

      // Armazenar o token na memória do navegador

      await asyncLocalStorage.setItem("Bearer", response.data)
      await asyncLocalStorage.setItem("email", email)

      //alert("Deu certo")

      // Redireciona o usuário para a rota autenticada.
      return navigate("/users")

    } catch (error) {
      alert("Deu algo errado")
    }

    // Aqui enviamos para a rota do servidor.

    /*handleForm({
      email: email,
      password: password
    })

    if (form?.password == '123') {
      console.log(form)
      return
    }

    console.log("Senha incorreta")*/
  }

    return ( 
      <div className='login'>
        {/*<img src={BackgroundImage} alt="Rocket"/>*/}
        <BackgroundImage />
        <h1>Login</h1>

        <form onSubmit={getForm}>

          <label htmlFor="email">E-mail: </label>
          <input
            required={true}
            name='email'
            type='email'
            placeholder='Informe seu e-mail'
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Senha: </label>
          <input
            required={true}
            name='password'
            type='password'
            placeholder='Informe a senha'
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type='submit'>
            Entrar
          </button>
        </form>
        
        <div className='links'>
          <Link text="Não consegue entrar?" redirect="/other"/>
          <Link text="Criar conta" redirect="/account/Usuário"/>
        </div>
      </div>
    )
  }