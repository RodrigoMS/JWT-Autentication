// Inclusão dos pacotes.
import Express, { response } from "express";
import cors from "cors";
//import auth from "./middlewares/auth";

// ----------- Configuração da validação de dados ------------
// Configuração das respostas de erro do Express Validation,
// conforme o código de erro.

import { UnauthorizedError } from "express-jwt";
import { ValidationError } from "express-validation";

const handleError = (error, req, res, next) => {

  // Retorna o erro quando a solicitação ao servidor não é valida.
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error)
  }

  // Retorna o erro quando o token de autenticação não é valido.
  if (error instanceof UnauthorizedError) {
    return res.status(error.status).json(error)
  }

  // Qualquer outro erro retorna o status 500
  // ( O servidor encontrou uma condição inesperada 
  //   que o impediu de atender a solicitação )
  return res.status(500).json(error)
}

// --------------------- Validação ----------------------------

// Validação de usuários
import { validate, Joi } from "express-validation";

// Validação de formulário de cadastro.
/*validate({
  body: Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(8).required()
  })
})*/

// Validação de login
const authLoginValidation = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// ------------- Token de autentificação -----------------
// Chave adicional para aumentar a segurança da criptografia.
const secret = {
  key: "RMS-Node-Express",
};

// ------------- Receber Token de validação --------------
import { expressjwt } from "express-jwt";

const auth = expressjwt({
  secret: secret.key,
  algorithms: ["HS256"]
})

// ----------------- Servidor e rotas --------------------
// Instancia o express.
const app = Express();

// Definição da interface de rede.
const port = 3000;

// Definição das aplicações externas que podem acessar a API.
const corsOptions = {
  origin: "http://localhost:5173",
  //origin: 'http://127.0.0.1:5173',
  optionsSuccessStatus: 200, // Para legacy browsers (IE11, várias SmartsTVs)
};

// Aplica cors a todas as rotas.
app.use(cors(corsOptions));

app.use(Express.json());

// Serviço oferecido no endereço raiz.
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Busca de categorias.
app.get("/news-api/v1/categories", (req, res) => {
  getCategories(res);
});

// Busca de noticias por categoria.
app.get("/news-api/v1/categories/:categoryId/news", (req, res) => {
  getNews(req, res);
});

// Busca de noticia especifica de uma categoria.
app.get("/news-api/v1/categories/:categoryId/news/:newsId", (req, res) => {
  getNewsContent(req, res);
});

app.post(
  "/news-api/v1/user",
  /*cors(corsOptions),*/ (req, res) => {
    setUser(req, res);
  }
);

// Rota autenticada com token.
app.get(
  "/news-api/v1/users",
  auth,
  /*cors(corsOptions),*/ (req, res) => {
    getUsers(req, res);
  }
);

// Valida os dados do usuário primeiro para depois passar para a autenticação.
app.post("/news-api/v1/login", authLoginValidation, login);

// Necessário para a validação de dados.
// Ele não é a validação em si mais serve para capturar o erro para 
// informar o usuário.
// Fica sempre depois das rotas pois são as rotas que vão gerar os erros e
// ele esta aqui para capturar estes erros.
// O authLoginValidation gera o erro e o handleError captura este erro para 
// devolver uma resposta.
app.use(handleError);

// Escuta solicitações e serve a aplicação Node.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// ---------------------- Banco de Dados -----------------------
// Inclusão dos pacotes.
import { createConnection } from "mysql2";

// Configuração da conexão com o banco de dados.
var connection = createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "APP_DATABASE",
});

// Abrir conexão com o banco de dados.
connection.connect();

// Realizar a busca no banco de dados.
function getCategories(response) {
  let sql = "SELECT id, name FROM APP_DATABASE.category;";

  // Busca os dados de forma assíncrona.
  // Parâmetros - Consulta e função que recebe como parâmetro:
  // err    - Falha na busca ou não estabelecer conexão;
  // rows   - Linhas de resposta do banco de dados;
  // fields - Mapeamento dos campos da tabela do banco de dados em consulta.
  connection.query(sql, function (err, rows) {
    // Caso não apresente erro, envia as linhas da tabela
    if (err) throw err;
    response.json({ rows }); // Retorna um json com um array "rows".
    // response.send(rows) // Retorna um Array.
  });

  // Fecha conexão com o banco de dados.
  // connection.end()
}

async function getNews(request, response) {
  let categoryId = request.params.categoryId;

  // ? - É um espaço reservado que faz com que o parâmetro "categoryId"
  //     seja tratado como uma string comum. Evitando o SQL injection.
  const query =
    "SELECT id, title FROM APP_DATABASE.news WHERE id_category = ?;";
  connection.query(query, [categoryId], function (err, rows) {
    if (err) throw err;
    response.send(rows);
    //response.send(rows[0])
    // response.json(rows)
  });
}

async function getNewsContent(request, response) {
  let categoryId = request.params.categoryId;
  let newsId = request.params.newsId;

  // ? - É um espaço reservado que faz com que o parâmetro "categoryId"
  //     seja tratado como uma string comum. Evitando o SQL injection.
  const query =
    "SELECT id, title, content FROM APP_DATABASE.news WHERE id_category = ? AND id = ?;";
  connection.query(query, [categoryId, newsId], function (err, rows) {
    if (err) throw err;
    response.status(200);
    response.send(rows);
    //response.send(rows[0])
    // response.json(rows)
  });
}

async function getUsers(request, response) {

  let sql = "SELECT id, name, email FROM APP_DATABASE.user;";

  connection.query(sql, function (err, rows) {
    if (err) throw err;
    //response.json({rows})
    response.status(200);
    response.send(rows);
  });
}

// Necessário biblioteca bcrypt para senhas criptografadas
import bcrypt from "bcryptjs";

async function setUser(request, response) {
  const body = request.body;

  const name = body.name;
  const email = body.email;
  const password = bcrypt.hashSync(body.password, 10);

  const query = "INSERT INTO user (name, email, password) VALUES (?,  ?, ?);";
  connection.query(query, [name, email, password], function (err, rows) {
    if (err) throw err
      response.status(201);
      response.send(rows);
  });
}

import pkg from "jsonwebtoken";

// Validação do usuário
async function login(request, response) {
  const { email, password } = request.body;

  const query =
    "SELECT id, email, password FROM APP_DATABASE.user WHERE email = ?";
  connection.query(query, [email], function (err, rows) {
    // Verifica se a requisição não teve erro.
    if (err !== null && typeof rows == "undefined") {
      return response.status(500).json("Erro na requisição do banco de dados.");
    }

    // Verifica se o usuário foi encontrado.
    if (rows.length == 0) {
      // 400 - Bad request, usuário não existe.
      return response.status(400).json("Email ou senha inválidos.");
    }

    // Verifica se a senha fornecida é igual a senha cadastrada no banco de dados.
    // Somente o bcrypt vai saber dizer de a senha cadastrada é igual
    // a senha fornecida.
    if(!bcrypt.compareSync(password, rows[0].password)) {
      // 401 - nâo autorizado.
      return response.status(401).json("Senha invalida")
    }

    // Encontrando o usuário gera um token e o retorna.
    const token = pkg.sign(
      {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
      },
      secret.key
    );
    return response.status(200).json(token);
  });
}

/* DQL, DDL e DML

function executeDQL(sql) {
  connection.connect()

  connection.query(sql, function(err, rows) {

    if (err) throw err
      return rows
  })

  connection.end()
}

async function getCategories(response) {
  let result = executeDQL('SELECT id, name FROM APP_DATABASE.category;')

  await response.send(result)
}

async function getNews(request, response) {
  let result = executeDQL('SELECT id, name FROM APP_DATABASE.category;')

  await response.send(result)
}*/
