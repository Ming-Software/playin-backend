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
};

export default participantRoutes;
