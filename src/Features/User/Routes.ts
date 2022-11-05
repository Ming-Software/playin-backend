import { FastifyInstance } from "fastify";
import {
  getUserDetailsResponse,
  getUserResponse,
  deleteUserResponse,
  patchUserResponse,
  patchUserRequest,
  getUsersPageResponse,
  getAllEventUsers,
  pageQuery,
} from "./Contracts";
import {
  getUserDetailsController,
  getUserController,
  deleteUserController,
  patchUserController,
  getUsersPageController,
  getAllEventUsersController,
} from "./Controllers";

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

  // getUsersPage
  app.get(
    "/userspage",
    {
      preHandler: app.auth([app.verifyAccessJWT]) as any,
      schema: { querystring: pageQuery, response: { 200: getUsersPageResponse } },
    },
    getUsersPageController
  );

  // get all event users
  app.get(
    "/event/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getAllEventUsers } } },
    getAllEventUsersController
  );
};

export default userRoutes;
