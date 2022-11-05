import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { appendFileSync } from "fs";
import {
  getEventsResponse,
  getEventResponse,
  statusEventResponse,
  newEventBody,
  patchEventBody,
  inviteUsersRequest,
  inviteUsersResponse,
  removeInviteUsersResponse,
} from "./Contracts";
import {
  getEventsController,
  newEventController,
  patchEventController,
  deleteEventController,
  getEventController,
  getUserEventsController,
  inviteUsersController,
  removeInviteUsersController,
} from "./Controllers";

const eventRoutes = async (app: FastifyInstance) => {
  // Event

  // Get all events
  app.get(
    "/events",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventsResponse } } },
    getEventsController
  );
  // Get one event
  app.get(
    "/event/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventResponse } } },
    getEventController
  );
  // get all events from one user
  app.get(
    "/users/:userID/events",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventsResponse } } },
    getUserEventsController
  );
  // create event
  app.post(
    "/events",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: newEventBody, response: { 200: statusEventResponse } } },
    newEventController
  );
  // update event
  app.patch(
    "/events/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: patchEventBody, response: { 200: getEventResponse } } },
    patchEventController
  );
  // delete event
  app.delete(
    "/events/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: statusEventResponse } } },
    deleteEventController
  );

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

export default eventRoutes;
