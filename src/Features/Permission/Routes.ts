import { FastifyInstance } from "fastify";
import {
  statusResponse,
  getEventPermissionResponse,
  getEventPermissionsResponse,
  acceptPermissionParams,
  eventIdParams,
} from "./Contracts";
import { sendPermissionController, removePermissionController, getEventPermissions } from "./Controllers";

const permissionRoutes = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      preHandler: app.auth([app.verifyAccessJWT]) as any,
      schema: { response: { 200: getEventPermissionsResponse } },
    },
    getEventPermissions
  );
  // Send Permission to participate in an event
  app.post(
    "/:eventID",
    {
      preHandler: app.auth([app.verifyAccessJWT]) as any,
      schema: { params: eventIdParams, response: { 200: getEventPermissionResponse } },
    },
    sendPermissionController
  );

  // Remove a permission sent from an event
  app.delete(
    "/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { params: eventIdParams, response: { 200: statusResponse } } },
    removePermissionController
  );
  // Accept a request to participate on a event
  app.post(
    "/accept/:EventID/:UserID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { params: acceptPermissionParams, response: { 200: statusResponse } } },
    removePermissionController
  );
};

export default permissionRoutes;
