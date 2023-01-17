import { expressJWT } from "express-jwt";

import secret from "../configs/secret";

export default expressJWT({
  secret: secret.key,
  algorithms: ["HS256"]
})