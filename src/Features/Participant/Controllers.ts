import { FastifyRequest, FastifyReply } from "fastify";

import prisma from "../../Utils/Prisma";
import * as Contracts from "./Contracts";

// Remove a Participant from an Event
export const removeParticipantByOwnerController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.DeleteParticipantByOwnerSchema.params.static;
		Body: typeof Contracts.DeleteParticipantByOwnerSchema.body.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// Verify if the event exists and check for permission
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");
		if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");

		// The user must exist
		const user = await prisma.user.findUnique({ where: { ID: req.body.UserID } });
		if (!user) throw new Error("User does not exist");

		// The user must have already asked for permission
		const participant = await prisma.eventParticipant.findUnique({
			where: { UserID_EventID: { UserID: user.ID, EventID: req.params.EventID } },
		});
		if (!participant) throw new Error("User is not a participant");

		// We delete the participant and update the current user on the event
		await prisma.eventParticipant.delete({
			where: { UserID_EventID: { EventID: req.params.EventID, UserID: req.body.UserID } },
		});
		await prisma.event.update({ where: { ID: event.ID }, data: { CurrentUsers: event.CurrentUsers - 1 } });

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Add a Participant to an Event
export const addParticipantController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.DeleteParticipantByOwnerSchema.params.static;
		Body: typeof Contracts.DeleteParticipantByOwnerSchema.body.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// Verify if the event exists and check for permission
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");

		const guest = await prisma.eventGuest.findUnique({
			where: { UserID_EventID: { UserID: req.body.UserID, EventID: req.params.EventID } },
		});

		const permission = await prisma.eventPermission.findUnique({
			where: { UserID_EventID: { UserID: req.body.UserID, EventID: req.params.EventID } },
		});

		if (guest) {
			if (guest.UserID !== req.user.ID) throw new Error("You do not have permmission");
			await prisma.eventGuest.delete({
				where: { UserID_EventID: { EventID: req.params.EventID, UserID: req.body.UserID } },
			});
		}
		if (permission) {
			if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");
			await prisma.eventPermission.delete({
				where: { UserID_EventID: { EventID: req.params.EventID, UserID: req.body.UserID } },
			});
		}
		if (!guest && !permission) throw new Error("Dont have an invite or request");

		// The user must exist
		const user = await prisma.user.findUnique({ where: { ID: req.body.UserID } });
		if (!user) throw new Error("User does not exist");

		// We create the participant and update the current user on the event
		await prisma.eventParticipant.create({ data: { EventID: req.params.EventID, UserID: req.body.UserID } });

		await prisma.event.update({ where: { ID: event.ID }, data: { CurrentUsers: event.CurrentUsers + 1 } });

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get Event Guests Page (only the creator may use this)
export const getEventParticipantsPageController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.GetEventParticipantsPageSchema.params.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// Verify if the event exists and we have permission
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");
		//if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");

		// We get the page of guests
		const participants = await prisma.eventParticipant.findMany({
			where: { EventID: req.params.EventID },
			orderBy: { CreatedAt: "desc" },
		});
		const total = await prisma.eventParticipant.count({ where: { EventID: req.params.EventID } });

		// We now get the details of each guest
		const guestsDetails = [];
		for (const item of participants) {
			const details = await prisma.user.findUnique({ where: { ID: item.UserID } });
			if (!details) continue;
			guestsDetails.push(details);
		}

		return res.status(200).send({ Guests: guestsDetails, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};
