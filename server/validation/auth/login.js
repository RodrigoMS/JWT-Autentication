// Validação de usuários
import { validate, Joi } from 'express-validation'

// Validação de formulário de cadastro.
/*validate({
  body: Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(8).required()
  })
})*/

// Validação de login
module.exports = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(8).required()
  })
})