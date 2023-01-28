import { Type } from "@sinclair/typebox";

// Create New Permission Schema
export const NewRequestSchema = {
	tags: ["Permission"],
	description: "Creates a new request to participate in an event. This can only be done if the event is public",
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

// Delete Permission Schema
export const CancelPermission = {
	tags: ["Permission"],
	description: "Cancel a request to an event. Only the requester may use this endpoint",
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

// Delete Permission Schema
export const DeletePermissionByOwnerSchema = {
	tags: ["Permission"],
	description: "Deletes a request to an event. Only the event creator may use this endpoint",
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

// Get Event Permissions Page Schema
export const GetEventPermissionsPageSchema = {
	tags: ["Permission"],
	description: "Returns a page of requests an event. This can only be called by the event creator",
	params: Type.Object({
		EventID: Type.String({ format: "uuid" }),
	}),
	querystring: Type.Object({
		Page: Type.Number(),
	}),
	response: {
		200: Type.Object({
			Permissions: Type.Array(
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

// Get User Permissions Page Schema
export const GetUserPermissionsPageSchema = {
	tags: ["Permission"],
	description: "Returns a page of requests the signed in user made.",
	querystring: Type.Object({
		Page: Type.Number(),
	}),
	response: {
		200: Type.Object({
			Permissions: Type.Array(
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
