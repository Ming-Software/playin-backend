import { Type } from "@sinclair/typebox";

// Get Signed In User Schema
export const GetSignedInUserSchema = {
	tags: ["User"],
	description: "Returns the Email, Name and Description of the signed in user",
	response: {
		200: Type.Object({
			ID: Type.String({ format: "uuid" }),
			Email: Type.String({ format: "email" }),
			Name: Type.String(),
			Description: Type.String(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Get User Details Schema
export const GetSignedInUserDetailsSchema = {
	tags: ["User"],
	description: "Returns a more complete profile of the signed in user",
	response: {
		200: Type.Object({
			ID: Type.String({ format: "uuid" }),
			Email: Type.String({ format: "email" }),
			Name: Type.String(),
			Description: Type.String(),
			Social: Type.String(),
			Activities: Type.Array(Type.String()),
			Admin: Type.Boolean(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

export const GetUserDetailsSchema = {
	tags: ["User"],
	description: "Returns a detailed profile of one user",
	params: Type.Object({
		UserID: Type.String({ format: "uuid" }),
	}),
	response: {
		200: Type.Object({
			ID: Type.String({ format: "uuid" }),
			Email: Type.String({ format: "email" }),
			Name: Type.String(),
			Description: Type.String(),
			Social: Type.String(),
			Activities: Type.Array(Type.String()),
			Admin: Type.Boolean(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Delete Signed In User Schema
export const DeleteSignedInUserSchema = {
	tags: ["User"],
	description: "Deletes the current signed in user",
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

// Update Signed In User Schema
export const UpdateSignedInUserSchema = {
	tags: ["User"],
	description: "Updates the current signed in user",
	body: Type.Object({
		Email: Type.Optional(Type.String({ format: "email" })),
		Name: Type.Optional(Type.String()),
		Description: Type.Optional(Type.String()),
		Social: Type.Optional(Type.String()),
		Activities: Type.Optional(Type.Array(Type.String())),
	}),
	response: {
		200: Type.Object({
			Email: Type.String({ format: "email" }),
			Name: Type.String(),
			Description: Type.String(),
			Social: Type.String(),
			Activities: Type.Array(Type.String()),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Get a Page of Users
export const GetUsersPageSchema = {
	tags: ["User"],
	description: "Returns a page of 30 users, each with ID, Email, Name and Description",
	querystring: Type.Object({
		Page: Type.Number(),
	}),
	response: {
		200: Type.Object({
			Users: Type.Array(
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

// Get a Page of Users
export const GetUsersFilterSchema = {
	tags: ["User"],
	description: "Returns all Users filtered by Name, each with ID, Email, Name",
	querystring: Type.Object({
		Name: Type.String(),
	}),
	response: {
		200: Type.Object({
			Users: Type.Array(
				Type.Object({
					ID: Type.String({ format: "uuid" }),
					Email: Type.String({ format: "email" }),
					Name: Type.String(),
				}),
			),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Get a Page of Users Details
export const GetUsersDetailsPageSchema = {
	tags: ["User"],
	description: "Returns a page of 30 users, each user with a more detailed description",
	querystring: Type.Object({
		Page: Type.Number(),
	}),
	response: {
		200: Type.Object({
			Users: Type.Array(
				Type.Object({
					ID: Type.String({ format: "uuid" }),
					Email: Type.String({ format: "email" }),
					Name: Type.String(),
					Description: Type.String(),
					Social: Type.String(),
					Activities: Type.Array(Type.String()),
					Admin: Type.Boolean(),
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
