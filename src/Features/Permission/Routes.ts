import { FastifyInstance } from "fastify";

import * as Contracts from "./Contracts";
import * as Controllers from "./Controllers";

const permissionRoutes = async (app: FastifyInstance) => {
	// Create new Permission
	app.post(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.NewRequestSchema,
		},
		Controllers.newRequestontroller,
	);

	// Delete Permission By Owner
	app.delete(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.DeletePermissionByOwnerSchema,
		},
		Controllers.removeGuestByOwnerController,
	);

	// Delete Permission By User Who made the Request

	// Get Event Requests Page
	app.get(
		"/permissionspage/event/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventPermissionsPageSchema,
		},
		Controllers.getEventPermissionsPageController,
	);

	// Get User Requests Page
	app.get(
		"/permissionspage/user/:UserID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventPermissionsPageSchema,
		},
		Controllers.getEventPermissionsPageController,
	);
};

export default permissionRoutes;
