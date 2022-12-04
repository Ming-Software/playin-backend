import { Type } from "@sinclair/typebox";

// Invite Users to an Event Schema
export const InviteUserSchema = {
	tags: ["Guest"],
	description: "Invites multiple users to participate in an event",
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

// Remove a Guest from an Event Schema
export const RemoveGuestSchema = {
	tags: ["Guest"],
	description: "Removes multiple guests from an event",
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

// Get Event Guests Page Schema
export const GetEventGuestsPage = {
	tags: ["Guest"],
	description: "Returns a page of invited users to an event",
	params: Type.Object({
		EventID: Type.String({ format: "uuid" }),
	}),
	querystring: Type.Object({
		Page: Type.Number(),
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

// Get User Invitations Page Schema
export const GetUserInvitationsPage = {
	tags: ["Guest"],
	description: "Returns a page of invitations a user has received",
	params: Type.Object({
		UserID: Type.String({ format: "uuid" }),
	}),
	querystring: Type.Object({
		Page: Type.Number(),
	}),
	response: {
		200: Type.Object({
			Guests: Type.Array(
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
