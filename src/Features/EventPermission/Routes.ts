import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { appendFileSync } from "fs";
import { statusResponse, getEventPermissionResponse, getEventPermissionsResponse } from "./Contracts";
import { sendPermissionController, removePermissionController, getEventPermissions } from "./Controllers";

const permissionRoutes = async (app: FastifyInstance) => {
  app.get(
    "/permissions",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventPermissionsResponse } } },
    getEventPermissions
  );
  // Send Permission to participate in an event
  app.post(
    "/permissions/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getEventPermissionResponse } } },
    sendPermissionController
  );

  // Remove a permission sent from an event
  app.delete(
    "/permissions/:eventID",
    { preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: statusResponse } } },
    removePermissionController
  );
};

export default permissionRoutes;
