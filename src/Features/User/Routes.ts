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

	app.get(
		"/userspage/details",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUsersDetailsPageSchema,
		},
		Controllers.getUsersPageDetailsController,
	);
};

export default userRoutes;
