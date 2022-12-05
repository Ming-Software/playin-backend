import { Type } from "@sinclair/typebox";

import EVENT from "../../Enums/Event";

// New Event Schema
export const NewEventSchema = {
	tags: ["Event"],
	description: "Creates a new event",
	body: Type.Object({
		Name: Type.String(),
		Description: Type.String(),
		Public: Type.Boolean({ default: EVENT.PUBLIC }),
		Start: Type.String({ format: "date-time" }),
		Finish: Type.String({ format: "date-time" }),
		Locale: Type.String(),
		MaxUsers: Type.Number(),
		CurrentUsers: Type.Number({ default: 1 }),
		Social: Type.String(),
		Activity: Type.String(),
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

// Get One Event Schema
export const GetEventSchema = {
	tags: ["Event"],
	description: "Returns a specific event given an ID",
	params: Type.Object({
		EventID: Type.String({ format: "uuid" }),
	}),
	response: {
		200: Type.Object({
			ID: Type.String({ format: "uuid" }),
			Name: Type.String(),
			Description: Type.String(),
			Public: Type.Boolean(),
			Start: Type.String({ format: "date-time" }),
			Finish: Type.String({ format: "date-time" }),
			Locale: Type.String(),
			MaxUsers: Type.Number(),
			CurrentUsers: Type.Number(),
			Social: Type.String(),
			Activity: Type.String(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Delete Event Schema
export const DeleteEventSchema = {
	tags: ["Event"],
	description: "Deletes a specific event given an ID. You must be logged as the event creator",
	params: Type.Object({
		EventID: Type.String({ format: "uuid" }),
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

// Update Event Schema
export const UpdateEventSchema = {
	tags: ["Event"],
	description: "Updates a specific event given an ID. You must be logged as the event creator",
	params: Type.Object({
		EventID: Type.String({ format: "uuid" }),
	}),
	body: Type.Object({
		Name: Type.Optional(Type.String()),
		Description: Type.Optional(Type.String()),
		Public: Type.Optional(Type.Boolean({ default: EVENT.PUBLIC })),
		Start: Type.Optional(Type.String({ format: "date-time" })),
		Finish: Type.Optional(Type.String({ format: "date-time" })),
		Locale: Type.Optional(Type.String()),
		MaxUsers: Type.Optional(Type.Number()),
		CurrentUsers: Type.Optional(Type.Number({ default: 1 })),
		Social: Type.Optional(Type.String()),
		Activity: Type.Optional(Type.String()),
	}),
	response: {
		200: Type.Object({
			Name: Type.String(),
			Description: Type.String(),
			Public: Type.Boolean(),
			Start: Type.String({ format: "date-time" }),
			Finish: Type.String({ format: "date-time" }),
			Locale: Type.String(),
			MaxUsers: Type.Number(),
			CurrentUsers: Type.Number(),
			Social: Type.String(),
			Activity: Type.String(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Get One Page of All Events
export const GetEventsPageSchema = {
	tags: ["Event"],
	description: "Returns a page of all events",
	querystring: Type.Object({
		Page: Type.Number(),
	}),
	response: {
		200: Type.Object({
			Events: Type.Array(
				Type.Object({
					ID: Type.String({ format: "uuid" }),
					Name: Type.String(),
					Description: Type.String(),
					Public: Type.Boolean(),
					Start: Type.String({ format: "date-time" }),
					Finish: Type.String({ format: "date-time" }),
					Locale: Type.String(),
					MaxUsers: Type.Number(),
					CurrentUsers: Type.Number(),
					Social: Type.String(),
					Activity: Type.String(),
					Creator: Type.String(),
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

// Get One Page of Events Created by One User Schema
export const GetEventsByUserPageSchema = {
	tags: ["Event"],
	description: "Returns a page of events created by one user",
	params: Type.Object({
		UserID: Type.String({ format: "uuid" }),
	}),
	querystring: Type.Object({
		Page: Type.Number(),
	}),
	response: {
		200: Type.Object({
			Events: Type.Array(
				Type.Object({
					ID: Type.String({ format: "uuid" }),
					Name: Type.String(),
					Description: Type.String(),
					Public: Type.Boolean(),
					Start: Type.String({ format: "date-time" }),
					Finish: Type.String({ format: "date-time" }),
					Locale: Type.String(),
					MaxUsers: Type.Number(),
					CurrentUsers: Type.Number(),
					Social: Type.String(),
					Activity: Type.String(),
					Creator: Type.String(),
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
