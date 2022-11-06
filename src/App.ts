import Fastify from "fastify";
import FastifyCORS from "@fastify/cors";
import FastifyJWT from "@fastify/jwt";
import FastifyCookie from "@fastify/cookie";
import FastifyAuth from "@fastify/auth";

import authRoutes from "./Features/Auth/Routes";
import userRoutes from "./Features/User/Routes";
import eventRoutes from "./Features/Event/Routes";
import permissionRoutes from "./Features/EventPermission/Routes";

import { verifyAccessJWT } from "./Decorators/JWT";
import guestRoutes from "./Features/Guest/Routes";
import permissionRoutes from "./Features/Permission/Routes";
import participantRoutes from "./Features/Participant/Routes";

const buildApp = () => {
  const app = Fastify();

  // Plugin
  app.register(FastifyAuth);
  app.register(FastifyCORS, { origin: ["http://localhost:5173", "http://127.0.0.1:5173"], credentials: true });
  app.register(FastifyJWT, { secret: String(process.env.ACCESS_SECRET), cookie: { cookieName: "RefreshToken", signed: true } });
  app.register(FastifyCookie, { secret: process.env.REFRESH_SECRET });

  // Decorators
  app.decorate("verifyAccessJWT", verifyAccessJWT);

  // Hooks

  // Routes
  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(userRoutes, { prefix: "/api/user" });
  app.register(guestRoutes, { prefix: "/api/guest" });
  app.register(permissionRoutes, { prefix: "/api/permission" });
  app.register(participantRoutes, { prefix: "/api/participant" });
  app.register(eventRoutes, { prefix: "/api/event" });

  // Checks the server connection
  app.get("/health", () => {
    return { Status: "OK" };
  });

  return app;
};

export default buildApp;
