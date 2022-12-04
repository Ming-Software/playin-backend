import { FastifyInstance } from "fastify";

import * as Contracts from "./Contracts";
import * as Controllers from "./Controllers";

const eventRoutes = async (app: FastifyInstance) => {
	// Create New Event
	app.post(
		"/",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.NewEventSchema,
		},
		Controllers.newEventController,
	);

	// Get One Event Given an ID
	app.get(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventSchema,
		},
		Controllers.getEventController,
	);

	// Delete Event Given an ID
	app.delete(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.DeleteEventSchema,
		},
		Controllers.deleteEventController,
	);

	// Update Event Given an ID
	app.patch(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.UpdateEventSchema,
		},
		Controllers.updateEventController,
	);

	// Get a Page of Events
	app.get(
		"/eventspage",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventsPageSchema,
		},
		Controllers.getEventsPageController,
	);

	// Get One Page of Events Created by One User
	app.get(
		"/eventspage/:UserID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventsByUserPageSchema,
		},
		Controllers.getEventsByUserPageController,
	);
};

export default eventRoutes;
