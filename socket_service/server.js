import "dotenv/config";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { registerSocketRuntime } from "./runtime.mjs";

const app = express();
const server = http.createServer(app);
const jwtSecret = process.env.JWT_SECRET || "development-only-change-me";
const djangoApi = process.env.DJANGO_API_URL || "http://localhost:8000/api/v1";
const port = Number(process.env.PORT || 4100);
const io = new Server(server, {
  cors: { origin: (process.env.FRONTEND_ORIGINS || "http://localhost:5173").split(","), credentials: true },
});

app.get("/health", (_request, response) => response.json({ service: "skill-swap-socket-service", status: "ok" }));

registerSocketRuntime(io, { jwtSecret, djangoApi });

server.listen(port, () => console.log(`Socket service listening on port ${port}`));
