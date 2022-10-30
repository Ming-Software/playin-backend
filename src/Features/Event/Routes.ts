import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { appendFileSync } from "fs";
import { getEventsResponse, getEventResponse, statusEventResponse, newEventBody, patchEventBody } from "./Contracts";
import { getEventsController, newEventController, patchEventController, deleteEventController } from "./Controllers";

const eventRoutes = async (app: FastifyInstance) => {
  // Event

  app.get(
    "/events",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventsResponse } } },
    getEventsController
  );
  //app.get("/event/:EventId", { preHandler: app.auth([app.verifyAccessJWT]) ,  schema: { response: { 200: getEventResponse } } } , getEventsController);
  app.post(
    "/events",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: newEventBody, response: { 200: statusEventResponse } } },
    newEventController
  );
  app.patch(
    "/events/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { body: patchEventBody, response: { 200: getEventResponse } } },
    patchEventController
  );
  app.delete(
    "/events/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: statusEventResponse } } },
    deleteEventController
  );
};

export default eventRoutes;
