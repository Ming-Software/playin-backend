import { Type } from "@sinclair/typebox";

import Activities from "../../Enums/Activities";
import Admin from "../../Enums/Admin";
import Social from "../../Enums/Social";

// Register Schema
export const RegisterSchema = {
	tags: ["Auth"],
	description: "Sign Up a user with role user as default",
	body: Type.Object({
		Email: Type.String({ format: "email" }),
		Password: Type.String(),
		Name: Type.String(),
		Admin: Type.Boolean({ default: Admin.USER }),
		Social: Type.String({ default: Social.NONE }),
		Activities: Type.Array(Type.String(), { default: [Activities.NONE] }),
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

// Login Schema
export const LoginSchema = {
	tags: ["Auth"],
	description: "Sign In a user",
	body: Type.Object({
		Email: Type.String({ format: "email" }),
		Password: Type.String(),
	}),
	response: {
		200: Type.Object({
			AccessToken: Type.String(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Refresh Schema
export const RefreshSchema = {
	tags: ["Auth"],
	description: "Generates a new AccessToken using the RefreshToken",
	response: {
		200: Type.Object({
			AccessToken: Type.String(),
			Status: Type.String({ default: "OK" }),
		}),
		500: Type.Object({
			Status: Type.String({ default: "ERROR" }),
			ErrorMessage: Type.String(),
		}),
	},
};

// Logout
export const LogoutSchema = {
	tags: ["Auth"],
	description: "Sign Out the signed in user",
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
