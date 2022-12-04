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

	// Remove an Invite from an Event
	app.delete(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.RemoveGuestSchema,
		},
		Controllers.removeGuestController,
	);

	// Get Event Guests Page
	app.get(
		"/guestspage/event/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventGuestsPage,
		},
		Controllers.getEventGuestsPageController,
	);

	// Get User Invitations Page
	app.get(
		"/guestspage/user/:UserID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetUserInvitationsPage,
		},
		Controllers.getUserInvitationsPageController,
	);
};

export default guestRoutes;
