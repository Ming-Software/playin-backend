import { FastifyInstance } from "fastify";
import { loginBody, loginResponse, registerBody, registerResponse } from "./Contracts";
import { loginController, logoutController, registerController, refreshController } from "./Controllers";

const authRoutes = async (app: FastifyInstance) => {
  // Register
  app.post("/register", { schema: { body: registerBody, response: { 200: registerResponse } } }, registerController);

  // Login
  app.post("/login", { schema: { body: loginBody, response: { 200: loginResponse } } }, loginController);

  // Refresh
  app.post("/refresh", refreshController);

  // Logout
  app.post("/logout", { preHandler: app.auth([app.verifyAccessJWT]) }, logoutController);

  // Health
  app.get("/health", { preHandler: app.auth([app.verifyAccessJWT]) }, async () => {
    return { Status: "OK" };
  });
};

export default authRoutes;
