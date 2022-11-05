import { FastifyInstance } from "fastify";
import { inviteUsersRequest, inviteUsersResponse, removeInviteUsersResponse } from "./Contracts";
import { inviteUsersController, removeInviteUsersController } from "./Controllers";

const guestRoutes = async (app: FastifyInstance) => {
  // Invite Users
  app.post(
    "/event/invite/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: inviteUsersRequest, response: { 200: inviteUsersResponse } } },
    inviteUsersController
  );

  // Remove an invite from an event
  app.delete(
    "/event/invite/:eventID/:userID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: removeInviteUsersResponse } } },
    removeInviteUsersController
  );
};

export default guestRoutes;
