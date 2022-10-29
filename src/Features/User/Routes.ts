import { FastifyInstance } from "fastify";
import { getUserResponse } from "./Contracts";
import { getUserController } from "./Controllers";

const userRoutes = async (app: FastifyInstance) => {
  // get
  app.get("/", { preHandler: app.auth([app.verifyAccessJWT]), schema: { response: { 200: getUserResponse } } }, getUserController);
};
// get  || patch || delete

export default userRoutes;
