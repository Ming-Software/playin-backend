import { Type } from "@sinclair/typebox";
import Activities from "../../Enums/Activities";
import Social from "../../Enums/Social";

// Register
export const registerBody = Type.Object({
  Email: Type.String({ format: "email" }),
  Password: Type.String(),
  ActivityPreference: Type.String({ default: Activities.NONE }),
  SocialPreference: Type.String({ default: Social.NONE }),
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
