import { FastifyRequest, FastifyReply } from "fastify";

import prisma from "../../Utils/Prisma";
import * as Contracts from "./Contracts";

// Invite Users
export const inviteUserController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.InviteUserSchema.params.static;
		Body: typeof Contracts.InviteUserSchema.body.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// Verify if the event exists and we have permission
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");
		if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");

		// The user must exist
		const user = await prisma.user.findUnique({ where: { ID: req.body.UserID } });
		if (!user) throw new Error("User does not exist");

		// The user must not be already participating
		const participant = await prisma.eventParticipant.findUnique({
			where: { UserID_EventID: { UserID: user.ID, EventID: req.params.EventID } },
		});
		if (participant) throw new Error("User is already participating");

		// The user must not have already asked for permission
		const permission = await prisma.eventPermission.findUnique({
			where: { UserID_EventID: { UserID: user.ID, EventID: req.params.EventID } },
		});
		if (permission) throw new Error("User has already asked for permission to participate");

		// The user must not have already been invited
		const guest = await prisma.eventGuest.findUnique({
			where: { UserID_EventID: { UserID: user.ID, EventID: req.params.EventID } },
		});
		if (guest) throw new Error("User has already been invited");

		await prisma.eventGuest.create({ data: { EventID: req.params.EventID, UserID: user.ID } });

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Remove an invite from an event (only the owner can delete)
export const removeGuestByOwnerController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.RemoveGuestByOwnerSchema.params.static;
		Body: typeof Contracts.RemoveGuestByOwnerSchema.body.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// Verify if the event exists
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");

		// We check for permission. Only the owner can delete this invite
		if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");

		// The user must exist
		const user = await prisma.user.findUnique({ where: { ID: req.body.UserID } });
		if (!user) throw new Error("User does not exist");

		// The user must have already been invited
		const guest = await prisma.eventGuest.findUnique({
			where: { UserID_EventID: { UserID: user.ID, EventID: req.params.EventID } },
		});
		if (!guest) throw new Error("User has not yet been invited");

		await prisma.eventGuest.delete({ where: { UserID_EventID: { EventID: req.params.EventID, UserID: user.ID } } });

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get Event Guests Page (only the creator may use this)
export const getEventGuestsPageController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.GetEventGuestsPageSchema.params.static;
		Querystring: typeof Contracts.GetEventGuestsPageSchema.querystring.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// Verify if the event exists and we have permission
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");
		if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");

		// We get the page of guests
		const guestsPerPage = 15;
		const guests = await prisma.eventGuest.findMany({
			where: { EventID: req.params.EventID },
			skip: (req.query.Page - 1) * guestsPerPage,
			take: guestsPerPage,
			orderBy: { CreatedAt: "desc" },
		});
		const total = await prisma.eventGuest.count({ where: { EventID: req.params.EventID } });

		// We now get the details of each guest
		const guestsDetails = [];
		for (const item of guests) {
			const details = await prisma.user.findUnique({ where: { ID: item.UserID } });
			if (!details) continue;
			guestsDetails.push(details);
		}

		return res.status(200).send({ Guests: guestsDetails, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get User Invitations Page of the Signed In User
export const getUserInvitationsSignedInController = async (
	req: FastifyRequest<{ Querystring: typeof Contracts.GetUserInvitationsSignedInPageSchema.querystring.static }>,
	res: FastifyReply,
) => {
	try {
		// We get the page of guests
		const guestsPerPage = 15;
		const invitations = await prisma.eventGuest.findMany({
			where: { UserID: req.user.ID },
			skip: (req.query.Page - 1) * guestsPerPage,
			take: guestsPerPage,
			orderBy: { CreatedAt: "desc" },
		});
		const total = await prisma.eventGuest.count({ where: { UserID: req.user.ID } });

		// We now get the details of each guest
		const invitationsDetails = [];
		for (const item of invitations) {
			const details = await prisma.event.findUnique({ where: { ID: item.EventID } });
			if (!details) continue;

			// We get the name of the acticivity and the creator
			const activity = await prisma.activity.findUnique({ where: { ID: details.ActivityID } });
			const creator = await prisma.user.findUnique({ where: { ID: details.UserID } });
			invitationsDetails.push({ ...details, Activity: activity?.Name, Creator: creator?.Name });
		}

		return res.status(200).send({ Guests: invitationsDetails, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};
