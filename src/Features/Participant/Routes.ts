import { FastifyInstance } from "fastify";
import { removeUserEvent } from "./Contracts";
import { removeUserEventController } from "./Controllers";

const participantRoutes = async (app: FastifyInstance) => {
  // Remove a user from an event
  app.delete(
    "/:eventID/:userID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: removeUserEvent } } },
    removeUserEventController
  );
};

export default participantRoutes;
