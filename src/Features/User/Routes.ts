import { FastifyInstance } from "fastify";

import * as Contracts from "./Contracts";
import * as Controllers from "./Controllers";

const userRoutes = async (app: FastifyInstance) => {
	// Get Signed In User
	app.get(
		"/",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetSignedInUserSchema,
		},
		Controllers.getSignedInUserController,
	);

	// Get Signed In User Details
	app.get(
		"/details",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetSignedInUserDetailsSchema,
		},
		Controllers.getSignedInUserDetailsController,
	);

	// Delete Signed In User
	app.delete(
		"/",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.DeleteSignedInUserSchema,
		},
		Controllers.deleteSignedInUserController,
	);

	// patch
	app.patch(
		"/",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.UpdateSignedInUserSchema,
		},
		Controllers.patchUserController,
	);

	// getUsersPage
	app.get(
		"/userspage",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUsersPageSchema,
		},
		Controllers.getUsersPageController,
	);

	// // get all event users
	// app.get(
	// 	"/event/:eventID",
	// 	{ preHandler: app.auth([app.verifyAccessJWT]) as any, schema: { response: { 200: getAllEventUsers } } },
	// 	getAllEventUsersController,
	// );
};

export default userRoutes;
