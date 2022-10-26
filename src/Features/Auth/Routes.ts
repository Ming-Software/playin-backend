import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { loginBody, loginResponse, logoutResponse, registerBody, registerResponse, refreshResponse } from "./Contracts";
import { loginController, logoutController, registerController, refreshController } from "./Controllers";

const authRoutes = async (app: FastifyInstance) => {
  // Register
  app.post("/register", { schema: { body: registerBody, response: { 200: registerResponse } } }, registerController);

  // Login
  app.post("/login", { schema: { body: loginBody, response: { 200: loginResponse } } }, loginController);

  // Refresh
  app.get("/refresh", { schema: { response: { 200: refreshResponse } } }, refreshController);

  // Logout
  app.get("/logout", { preHandler: app.auth([app.verifyAccessJWT]), schema: { response: { 200: logoutResponse } } }, logoutController);

  // Auth Health Checks
  app.get("/health", { preHandler: app.auth([app.verifyAccessJWT]) }, async (req: FastifyRequest, _res: FastifyReply) => {
    return { Status: "OK", ID: req.user.ID };
  });
  app.post("/health", { preHandler: app.auth([app.verifyAccessJWT]) }, async (req: FastifyRequest, _res: FastifyReply) => {
    return { Status: "OK", ID: req.user.ID };
  });
  app.put("/health", { preHandler: app.auth([app.verifyAccessJWT]) }, async (req: FastifyRequest, _res: FastifyReply) => {
    return { Status: "OK", ID: req.user.ID };
  });
  app.patch("/health", { preHandler: app.auth([app.verifyAccessJWT]) }, async (req: FastifyRequest, _res: FastifyReply) => {
    return { Status: "OK", ID: req.user.ID };
  });
  app.delete("/health", { preHandler: app.auth([app.verifyAccessJWT]) }, async (req: FastifyRequest, _res: FastifyReply) => {
    return { Status: "OK", ID: req.user.ID };
  });
};

export default authRoutes;
