import { FastifyRequest, FastifyReply } from "fastify";

import prisma from "../../Utils/Prisma";
import * as Contracts from "./Contracts";

// Create New Event Controller
export const newEventController = async (
	req: FastifyRequest<{ Body: typeof Contracts.NewEventSchema.body.static }>,
	res: FastifyReply,
) => {
	try {
		// We verify that the activity and the dates are valid
		const activity = await prisma.activity.findUnique({ where: { Name: req.body.Activity } });
		if (!activity) throw new Error(`Activity ${req.body.Activity} does not exist`);
		if (req.body.Start >= req.body.Finish) throw new Error("Finish date is either equal or inferior to start date");

		const event = await prisma.event.create({
			data: {
				Name: req.body.Name,
				Description: req.body.Description,
				Public: req.body.Public,
				Start: new Date(req.body.Start),
				Finish: new Date(req.body.Finish),
				Locale: req.body.Locale,
				MaxUsers: req.body.MaxUsers,
				CurrentUsers: req.body.CurrentUsers,
				Social: req.body.Social,
				ActivityID: activity.ID,
				UserID: req.user.ID,
			},
		});

		// We add ourselves as a participant
		await prisma.eventParticipant.create({ data: { EventID: event.ID, UserID: req.user.ID } });

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get One Event Given an ID
export const getEventController = async (
	req: FastifyRequest<{ Params: typeof Contracts.GetEventSchema.params.static }>,
	res: FastifyReply,
) => {
	try {
		// We get the event from the db
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");

		// We get the activity from the db
		const activity = await prisma.activity.findUnique({ where: { ID: event.ActivityID } });
		if (!activity) throw new Error("Activity does not exist");

		// We get the user from the db
		const user = await prisma.user.findUnique({ where: { ID: event.UserID } });
		if (!user) throw new Error("User does not exist");

		return res.status(200).send({ ...event, Activity: activity.Name, User: user.Name });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Delete an Event Given an ID
export const deleteEventController = async (
	req: FastifyRequest<{ Params: typeof Contracts.DeleteEventSchema.params.static }>,
	res: FastifyReply,
) => {
	try {
		// We must verify that the event exists and that we have the permission to delete it (we are the creators)
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");
		if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");

		// We delete the event
		await prisma.event.delete({ where: { ID: req.params.EventID } });

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Update an Event Given an ID
export const updateEventController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.UpdateEventSchema.params.static;
		Body: typeof Contracts.UpdateEventSchema.body.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// We must verify that the event exists and that we have the permission to delete it (we are the creators)
		const event = await prisma.event.findUnique({ where: { ID: req.params.EventID } });
		if (!event) throw new Error("Event does not exist");
		if (event.UserID !== req.user.ID) throw new Error("You do not have permmission");

		let activity = undefined;
		let startDate = undefined;
		let finishDate = undefined;

		// We must verify that the acitivity, if updated, exists
		if (req.body.Activity) {
			activity = await prisma.activity.findUnique({ where: { Name: req.body.Activity } });
			if (!activity) throw new Error("Activity does not exist");
		}

		// We must verify both the start and finish date if to be changed
		if (req.body.Start && req.body.Finish) {
			const startDate = new Date(req.body.Start);
			const finishDate = new Date(req.body.Finish);
			if (startDate >= finishDate) throw new Error("Finish date is either equal or inferior to start date");
		}
		// We must verify the start date if to be changed
		else if (req.body.Start) {
			startDate = new Date(req.body.Start);
			if (startDate >= event.Finish) throw new Error("Finish date is either equal or inferior to start date");
		}
		// We must verify the finish date if to be changed
		else if (req.body.Finish) {
			finishDate = new Date(req.body.Finish);
			if (event.Start >= finishDate) throw new Error("Finish date is either equal or inferior to start date");
		}

		// We update the event and get the new/old activity
		const eventUpdated = await prisma.event.update({
			data: {
				Name: req.body.Name,
				Description: req.body.Description,
				Public: req.body.Public,
				Start: startDate,
				Finish: finishDate,
				Locale: req.body.Locale,
				MaxUsers: req.body.MaxUsers,
				CurrentUsers: req.body.CurrentUsers,
				Social: req.body.Social,
				ActivityID: activity?.ID,
				UserID: req.user.ID,
			},
			where: { ID: req.params.EventID },
		});
		activity = await prisma.activity.findUnique({ where: { ID: eventUpdated.ActivityID } });

		return res.status(200).send({ ...eventUpdated, Activity: activity?.Name });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

export const getEventsByUserPageController = async (
	req: FastifyRequest<{
		Params: typeof Contracts.GetEventsByUserPageSchema.params.static;
		Querystring: typeof Contracts.GetEventsByUserPageSchema.querystring.static;
	}>,
	res: FastifyReply,
) => {
	try {
		// We get the page of events
		const eventsPerPage = 15;
		const events = await prisma.event.findMany({
			where: { UserID: req.params.UserID },
			skip: (req.query.Page - 1) * eventsPerPage,
			take: eventsPerPage,
			orderBy: { CreatedAt: "desc" },
		});

		// We get the name of the acticivity and of the user
		const eventsPage = [];
		const creator = await prisma.user.findUnique({ where: { ID: req.params.UserID } });
		for (const item of events) {
			const activity = await prisma.activity.findUnique({ where: { ID: item.ActivityID } });
			eventsPage.push({ ...item, Activity: activity?.Name, Creator: creator?.Name });
		}

		// We get the total events of this user
		const total = await prisma.event.count({ where: { UserID: req.params.UserID } });

		return res.status(200).send({ Events: eventsPage, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

export const getEventsPageController = async (
	req: FastifyRequest<{ Querystring: typeof Contracts.GetEventsPageSchema.querystring.static }>,
	res: FastifyReply,
) => {
	try {
		// We get the page of events
		const eventsPerPage = 15;
		const events = await prisma.event.findMany({
			skip: (req.query.Page - 1) * eventsPerPage,
			take: eventsPerPage,
			orderBy: { CreatedAt: "desc" },
		});

		// We get the name of the acticivity and of the creator
		const eventsPage = [];
		for (const item of events) {
			const activity = await prisma.activity.findUnique({ where: { ID: item.ActivityID } });
			const creator = await prisma.user.findUnique({ where: { ID: item.UserID } });
			eventsPage.push({ ...item, Activity: activity?.Name, Creator: creator?.Name });
		}

		// We get the total events of this user
		const total = await prisma.event.count();

		return res.status(200).send({ Events: eventsPage, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};
