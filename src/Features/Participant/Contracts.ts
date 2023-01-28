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

// Add Participant to an Event
export const AddParticipant = {
	tags: ["Participant"],
	description: "Adds a participant to an event. Only the event creator and guest may use this endpoint",
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

// Add Participant to an Event
export const GetEventParticipantsPageSchema = {
	tags: ["Participant"],
	description: "Returns all participants in an event.",
	params: Type.Object({
		EventID: Type.String({ format: "uuid" }),
	}),
	response: {
		200: Type.Object({
			Guests: Type.Array(
				Type.Object({
					ID: Type.String({ format: "uuid" }),
					Email: Type.String({ format: "email" }),
					Name: Type.String(),
					Description: Type.String(),
				}),
			),
			Total: Type.Number(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};
