import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { appendFileSync } from "fs";
import { getEventsResponse, getEventResponse, statusEventResponse, newEventBody, patchEventBody } from "./Contracts";
import {
  getEventsController,
  newEventController,
  patchEventController,
  deleteEventController,
  getEventController,
  getUserEventsController,
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
};

export default eventRoutes;
