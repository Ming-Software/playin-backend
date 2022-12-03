import { FastifyInstance } from "fastify";
import {
  getEventsResponse,
  getEventResponse,
  statusEventResponse,
  newEventBody,
  patchEventBody,
  getEventsPageQuery,
  getEventsPageResponse,
} from "./Contracts";
import {
  getEventsController,
  newEventController,
  patchEventController,
  deleteEventController,
  getEventController,
  getUserEventsController,
  getEventsPageController,
} from "./Controllers";

const eventRoutes = async (app: FastifyInstance) => {
  // Get all events
  app.get(
    "/",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventsResponse } } },
    getEventsController
  );

  // Get one event
  app.get(
    "/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventResponse } } },
    getEventController
  );

  // get all events from one user
  app.get(
    "/users/:userID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventsResponse } } },
    getUserEventsController
  );

  // create event
  app.post(
    "/",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: newEventBody, response: { 200: statusEventResponse } } },
    newEventController
  );

  // update event
  app.patch(
    "/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: patchEventBody, response: { 200: getEventResponse } } },
    patchEventController
  );

  // delete event
  app.delete(
    "/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: statusEventResponse } } },
    deleteEventController
  );

  // Get event Page
  app.get(
    "/eventspage",
    {
      preHandler: app.auth([app.verifyAccessJWT]) as any,
      schema: { querystring: getEventsPageQuery, response: { 200: getEventsPageResponse } },
    },
    getEventsPageController
  );
};

export default eventRoutes;
