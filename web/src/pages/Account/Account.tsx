import { FormEvent, useState } from 'react';
import { FormEncType, useParams } from 'react-router-dom'

import Link from '../../components/Link';
import { accountUser } from '../../services/MainApi/users';

// Importação do estilo CSS
import './account.css'

// Importação de imagens OBS: As imagens são tratadas como componentes.
// import BackgroundImage from '../../components/RocketSVG/RocketSVG'

interface accountForm{
  name            :string
  email           :string
  password        :string
  confirmPassword :string
}

export const Account = () => {
  const params = useParams()

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [form, handleForm] = useState<accountForm>()

  const account = async (event :FormEvent) => {
    event.preventDefault()

    const payload = {
      name,
      email,
      password
    }

    try {

      const response = await accountUser(payload)
      
      if (response.status !== 201) {
        return alert("Deu Algo errado.")
      }

      alert("Cadastro efetuado com sucesso!")
      
    } catch (error) {
      alert("Deu Algo errado.")
    }
  }

  return (
    <div className='account'>

      <h1>Criar conta</h1>
      <h2>Olá {params.name}</h2>

      <form onSubmit={account}>
        <label htmlFor="name">Nome: </label>
        <input
          required={true}
          name='name'
          type='name'
          placeholder='Informe o seu nome completo'
          onChange={(event) => setName(event.target.value)}
        />

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

        <label htmlFor="confirmPassword">Confirme a senha: </label>
        <input
          required={true}
          name='confirmPassword'
          type='password'
          placeholder='Informe a senha'
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <button type='submit'>
          Criar
        </button>
      </form>
      
      <div className='links'>
        <Link text="Login" redirect="/"/>
      </div>
    </div>
  )
}