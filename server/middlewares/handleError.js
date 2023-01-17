// Configuração das respostas do Express Validation,
// conforme o código de erro.

import { UnauthorizedError } from "express-jwt";
import { ValidationError } from "express-validation";

export default (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error)
  }

  if (error instanceof UnauthorizedError) {
    return res.status(error.status).json(error)
  }

  return res.status(500).json(error)
}