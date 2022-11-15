import { Type } from "@sinclair/typebox";

export const getEventPermissionsResponse = Type.Array(
  Type.Object({
    EventID: Type.String({ format: "uuid" }),
    UserID: Type.String({ format: "uuid" }),
  })
);

export const getEventPermissionResponse = Type.Object({
  EventID: Type.String({ format: "uuid" }),
  UserID: Type.String({ format: "uuid" }),
});

export const statusResponse = Type.Object({
  Status: Type.String({ default: "OK" }),
});

export const eventIdParams = Type.Object({
  eventID: Type.String({ format: "uuid" }),
});

// Accept Permissions
export const acceptPermissionParams = Type.Object({
  EventID: Type.String({ format: "uuid" }),
  UserID: Type.String({ format: "uuid" }),
});
