import { FastifyInstance } from "fastify";
import {
  getUserInvitationsResponse,
  inviteUserRequest,
  inviteUserResponse,
  inviteUsersRequest,
  inviteUsersResponse,
  removeInviteUsersResponse,
} from "./Contracts";
import { getUserInvitationsController, inviteUserController, inviteUsersController, removeInviteUsersController } from "./Controllers";

const guestRoutes = async (app: FastifyInstance) => {
  // Invite Users
  app.post(
    "/event/invites/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: inviteUsersRequest, response: { 200: inviteUsersResponse } } },
    inviteUsersController
  );

  // Invite User
  app.post(
    "/event/invite/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: inviteUserRequest, response: { 200: inviteUserResponse } } },
    inviteUserController
  );

  // Remove an invite from an event
  app.delete(
    "/event/invite/:eventID/:userID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: removeInviteUsersResponse } } },
    removeInviteUsersController
  );

  // User invitations
  app.get(
    "/user",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getUserInvitationsResponse } } },
    getUserInvitationsController
  );
};

export default guestRoutes;
