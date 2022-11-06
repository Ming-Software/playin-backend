import { Type } from "@sinclair/typebox";

export const getEventPermissionsResponse = Type.Array(
  Type.Object({
    EventID: Type.String(),
    UserID: Type.String(),
  })
);

export const getEventPermissionResponse = Type.Object({
  EventID: Type.String(),
  UserID: Type.String(),
});

export const statusResponse = Type.Object({
  Status: Type.String({ default: "OK" }),
});

export const eventIdParams = Type.Object({
  eventID: Type.String(),
});
