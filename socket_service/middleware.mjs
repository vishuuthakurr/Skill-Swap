import { authenticateSocket } from "./security.mjs";

export function registerAuthMiddleware(io, jwtSecret) {
  io.use((socket, next) => {
    try {
      socket.data.user = authenticateSocket(socket.handshake, jwtSecret);
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });
}
