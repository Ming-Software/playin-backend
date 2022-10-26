import { FastifyInstance } from "fastify";
import { getUserResponse } from "./Contracts";

const userRoutes = async (app: FastifyInstance) => {
  // get
  app.get("/", { preHandler: app.auth([app.verifyAccessJWT]), schema: { response: { 200: getUserResponse } } }, () => 1);
};
// get  || patch || delete

export default userRoutes;
