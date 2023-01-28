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
		"/cancel/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.RemoveGuestByOwnerSchema,
		},
		Controllers.removeGuestByOwnerController,
	);

	// Decline an Invite from an Event (Called by the guest)
	app.delete(
		"/decline/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.DeclineGuestInvite,
		},
		Controllers.declineGuestInvite,
	);

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
			schema: Contracts.GetUserInvitationsSignedInPageSchema,
		},
		Controllers.getUserInvitationsSignedInController,
	);
};

export default guestRoutes;
