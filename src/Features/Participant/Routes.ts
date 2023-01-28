import { FastifyInstance } from "fastify";

import * as Contracts from "./Contracts";
import * as Controllers from "./Controllers";

const participantRoutes = async (app: FastifyInstance) => {
	// Remove a Participant from an Event, By Owner
	app.delete(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.DeleteParticipantByOwnerSchema,
		},
		Controllers.removeParticipantByOwnerController,
	);

	// Add a Participant to an Event, By Owner or Guest
	app.post(
		"/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.AddParticipant,
		},
		Controllers.addParticipantController,
	);

	// Get Event Participants Page
	app.get(
		"/participantspage/event/:EventID",
		{
			preHandler: app.auth([app.verifyJWT]) as any,
			schema: Contracts.GetEventParticipantsPageSchema,
		},
		Controllers.getEventParticipantsPageController,
	);
};

export default participantRoutes;
