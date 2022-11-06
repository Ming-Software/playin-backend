import { Type } from "@sinclair/typebox";

// Invite Users
export const inviteUsersRequest = Type.Array(Type.Object({ ID: Type.String({ format: "uuid" }) }));
export const inviteUsersResponse = Type.Array(Type.Object({ ID: Type.String({ format: "uuid" }) }));

// Invite User
export const inviteUserRequest = Type.Object({
  ID: Type.String({ format: "uuid" }),
});
export const inviteUserResponse = Type.String({ format: "uuid" });

// Remove an invite from an event
export const removeInviteUsersResponse = Type.Object({
  ID: Type.String({ format: "uuid" }),
  Name: Type.String(),
});

// User invitations
export const getUserInvitationsResponse = Type.Array(
  Type.Object({
    ID: Type.String({ format: "uuid" }),
    Name: Type.String(),
    Description: Type.String(),
    Start: Type.String({ format: "date-time" }),
    Finish: Type.String({ format: "date-time" }),
    Public: Type.Boolean(),
    MaxUsers: Type.Number(),
    CurrentUsers: Type.Number(),
    Locale: Type.String(),
    Activity: Type.String(),
    Social: Type.String(),
  })
);
