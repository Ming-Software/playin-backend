import { Type } from "@sinclair/typebox";
import Activities from "../../Enums/Activity";
import Social from "../../Enums/Social";

// Register
export const registerBody = Type.Object({
  Email: Type.String({ format: "email" }),
  Password: Type.String(),
  ActivityPreference: Type.String({ default: Activities.NONE }),
  SocialPreference: Type.String({ default: Social.NONE }),
});

export const registerResponse = Type.Object({
  ID: Type.String({ format: "uuid" }),
});

// Login
export const loginBody = Type.Object({
  Email: Type.String({ format: "email" }),
  Password: Type.String(),
});

export const loginResponse = Type.Object({
  AccessToken: Type.String(),
});
