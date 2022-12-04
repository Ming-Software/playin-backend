import { FastifyInstance } from "fastify";

import * as Contracts from "./Contracts";
import * as Controllers from "./Controllers";

const guestRoutes = async (app: FastifyInstance) => {
	// Invite Users
	app.post(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.InviteUserSchema,
		},
		Controllers.inviteUserController,
	);

	// Remove an Invite from an Event (Called by the owner)
	app.delete(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.RemoveGuestByOwnerSchema,
		},
		Controllers.removeGuestByOwnerController,
	);

	// Remove a Guest from an Event by the Guest

	// Get Event Guests Page
	app.get(
		"/guestspage/event/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventGuestsPageSchema,
		},
		Controllers.getEventGuestsPageController,
	);

	// Get User Invitations Page by Signed In User
	app.get(
		"/guestspage/user",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUserInvitationsPageSchema,
		},
		Controllers.getUserInvitationsPageController,
	);
};

export default guestRoutes;
