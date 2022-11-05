import { Type } from "@sinclair/typebox";

// Remove a user from an event
export const removeUserEvent = Type.Object({
  ID: Type.String(),
  Name: Type.String(),
});

export const eventUserIdParams = Type.Object({
  eventID: Type.String(),
  userID: Type.String(),
});
