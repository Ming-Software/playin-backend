import { Type } from "@sinclair/typebox";

// Remove a user from an event
export const removeUserEvent = Type.Object({
  ID: Type.String({ format: "uuid" }),
  Name: Type.String(),
});

export const eventUserIdParams = Type.Object({
  eventID: Type.String({ format: "uuid" }),
  userID: Type.String({ format: "uuid" }),
});
