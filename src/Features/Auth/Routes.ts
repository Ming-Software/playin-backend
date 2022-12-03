import { FastifyInstance } from "fastify";

import * as Contracts from "./Contracts";
import * as Controllers from "./Controllers";

const authRoutes = async (app: FastifyInstance) => {
	// Register
	app.post(
		"/register",
		{
			schema: Contracts.RegisterSchema,
		},
		Controllers.registerController,
	);

	// Login
	app.post(
		"/login",
		{
			schema: Contracts.LoginSchema,
		},
		Controllers.loginController,
	);

	// Refresh
	app.get(
		"/refresh",
		{
			schema: Contracts.RefreshSchema,
		},
		Controllers.refreshController,
	);

	// Logout
	app.get(
		"/logout",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.LogoutSchema,
		},
		Controllers.logoutController,
	);
};

export default authRoutes;
