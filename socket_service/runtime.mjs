import jwt from "jsonwebtoken";
import { registerAuthMiddleware } from "./middleware.mjs";
import { registerConnectionHandlers } from "./handlers.mjs";

export function registerSocketRuntime(io, { jwtSecret, djangoApi, fetchImpl = fetch, registerHandlers = registerConnectionHandlers }) {
  registerAuthMiddleware(io, jwtSecret);
  io.on("connection", socket => {
    const userId = String(socket.data.user.sub);
    const internalToken = jwt.sign({ sub: userId, token_type: "access", service: "socket" }, jwtSecret, { expiresIn: "60s" });
    registerHandlers({ io, socket, userId, jwtToken: internalToken, djangoApi, fetchImpl });
  });
}
