import { FastifyInstance } from "fastify";
import { getUserDetailsResponse, getUserResponse, deleteUserResponse } from "./Contracts";
import { getUserDetailsController, getUserController, deleteUserController } from "./Controllers";

const userRoutes = async (app: FastifyInstance) => {
  // get
  app.get("/", { preHandler: app.auth([app.verifyAccessJWT]), schema: { response: { 200: getUserResponse } } }, getUserController);

  // get details
  app.get(
    "/details",
    { preHandler: app.auth([app.verifyAccessJWT]), schema: { response: { 200: getUserDetailsResponse } } },
    getUserDetailsController
  );

  // delete
  app.delete("/", { preHandler: app.auth([app.verifyAccessJWT]), schema: { response: { 200: deleteUserResponse } } }, deleteUserController);

  // patch
};

export default userRoutes;
