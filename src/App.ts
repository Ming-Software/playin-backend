import Fastify from "fastify";
import FastifyCORS from "@fastify/cors";
import FastifyJWT from "@fastify/jwt";
import FastifyCookie from "@fastify/cookie";
import FastifyAuth from "@fastify/auth";

import authRoutes from "./Features/Auth/Routes";

import { verifyAccessJWT } from "./Decorators/JWT";

const buildApp = () => {
  const app = Fastify();

  // Plugin
  app.register(FastifyCORS, { origin: false });
  app.register(FastifyAuth, { defaultRelation: "or" });
  app.register(FastifyCookie, { secret: process.env.REFRESH_SECRET });
  app.register(FastifyJWT, { secret: String(process.env.REFRESH_SECRET), cookie: { cookieName: "refreshToken", signed: true } });

  // Decorators
  app.decorate("verifyAccessJWT", verifyAccessJWT);

  // Hooks

  // Routes
  app.register(authRoutes, { prefix: "/api/auth" });

  // Checks the server connection
  app.get("/health", () => {
    return { Status: "OK" };
  });

  return app;
};

export default buildApp;
