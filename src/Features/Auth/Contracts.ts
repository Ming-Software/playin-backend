import { Type } from "@sinclair/typebox";
import Activities from "../../Enums/Activities";
import Admin from "../../Enums/Admin";
import Social from "../../Enums/Social";

// Register
export const registerBody = Type.Object({
  Email: Type.String({ format: "email" }),
  Password: Type.String(),
  Name: Type.String(),
  Admin: Type.Boolean({ default: Admin.USER }),
  Social: Type.String({ default: Social.NONE }),
  Activities: Type.Array(Type.String(), { default: [Activities.NONE] }),
});

export const registerResponse = Type.Object({
  Status: Type.String(),
});

// Login
export const loginBody = Type.Object({
  Email: Type.String({ format: "email" }),
  Password: Type.String(),
});

export const loginResponse = Type.Object({
  AccessToken: Type.String(),
});

// Refresh
export const refreshResponse = Type.Object({
  AccessToken: Type.String(),
});

// Logout
export const logoutResponse = Type.Object({
  Status: Type.String(),
});
