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

	// Get All Filtered Users with minimal information
	app.get(
		"/filter",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUsersFilterSchema,
		},
		Controllers.getUsersFilterController,
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

	// Get User Details
	app.get(
		"/userprofile/:UserID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUserDetailsSchema,
		},
		Controllers.getUserDetailsController,
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

	// Update Signed In User
	app.patch(
		"/",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.UpdateSignedInUserSchema,
		},
		Controllers.patchUserController,
	);

	// Get a Page of All the Users with minimal information
	app.get(
		"/userspage",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUsersPageSchema,
		},
		Controllers.getUsersPageController,
	);

	// Get a Page of All the Users with detailed information
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
