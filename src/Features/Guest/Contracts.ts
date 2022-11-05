import { Type } from "@sinclair/typebox";

// Invite Users
export const inviteUsersRequest = Type.Array(Type.String());
export const inviteUsersResponse = Type.Array(Type.String());

// Remove an invite from an event
export const removeInviteUsersResponse = Type.Object({
  ID: Type.String({ format: "uuid" }),
  Name: Type.String(),
});
