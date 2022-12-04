import { Type } from "@sinclair/typebox";

// Remove a Participant from an Event By Owner
export const DeleteParticipantByOwnerSchema = {
	tags: ["Participant"],
	description: "Deletes a participant from an event. Only the event creator may use this endpoint",
	params: Type.Object({
		EventID: Type.String({ format: "uuid" }),
	}),
	body: Type.Object({
		UserID: Type.String({ format: "uuid" }),
	}),
	response: {
		200: Type.Object({
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};
