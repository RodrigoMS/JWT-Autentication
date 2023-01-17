//import { User } from '../models'
//import bcrypt from 'bcryptjs'
import pkg from "jsonwebtoken";

const AuthController = {
    async login(request, response) {
      const { email, password } = request.body

      // findOne - Busca apenas um registro.
      // findAll - Busca todos os registros.
      const user = await User.findOne({
        where: {
          email
        }
      })

      // Se o usuário não existe.
      if(!user) {
        // Bad request, usuário não existe.
        return response.status(400).json("Email não cadastrado!")
      }

      // Verifica se a senha retornada é igual a senha cadastrada.
      // somente o bcrypt vai saber dizer de a senha cadastrada é igual
      // a senha fornecida.
      if(!bcrypt.compareSync(password, user.password)) {
        // 401 - nâo autorizado.
        return response.status(401).json("Senha invalida")
      }

      const token = pkg.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        secret.key
      );

      return response.json(token)
    }
}

export default AuthController