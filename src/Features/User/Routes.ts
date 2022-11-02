import { FastifyInstance } from "fastify";
import { getUserDetailsResponse, getUserResponse, deleteUserResponse, patchUserResponse, patchUserRequest } from "./Contracts";
import { getUserDetailsController, getUserController, deleteUserController, patchUserController } from "./Controllers";

const userRoutes = async (app: FastifyInstance) => {
  // get
  app.get("/", { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getUserResponse } } }, getUserController);

  // get details
  app.get(
    "/details",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getUserDetailsResponse } } },
    getUserDetailsController
  );

  // delete
  app.delete(
    "/",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: deleteUserResponse } } },
    deleteUserController
  );

  // patch
  app.patch(
    "/",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: patchUserRequest, response: { 200: patchUserResponse } } },
    patchUserController
  );
};

export default userRoutes;
