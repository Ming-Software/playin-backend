import { Type } from "@sinclair/typebox";

// Register
export const registerBody = Type.Object({
  Email: Type.String({ format: "email" }),
  Password: Type.String(),
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
  Token: Type.String(),
});
