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
		"/decline/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.DeletePermissionByOwnerSchema,
		},
		Controllers.removeGuestByOwnerController,
	);

	// Get Event Requests Page By Owner
	app.get(
		"/permissionspage/event/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventPermissionsPageSchema,
		},
		Controllers.getEventPermissionsPageController,
	);

	// Get User Requests Page by Signed In User
	app.get(
		"/permissionspage/user",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUserPermissionsPageSchema,
		},
		Controllers.getUserPermissionsPageController,
	);
};

export default permissionRoutes;
