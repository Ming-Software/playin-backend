import { Type } from "@sinclair/typebox";
import EventStatus from "../../Enums/Event";

// New Event
export const newEventBody = Type.Object({
  Name: Type.String(),
  Description: Type.String(),
  Start: Type.String({ format: "date-time" }),
  Finish: Type.String({ format: "date-time" }),
  Public: Type.Boolean({ default: EventStatus.PUBLIC }),
  MaxUsers: Type.Number(),
  CurrentUsers: Type.Number({ default: 1 }),
  Locale: Type.String(),
  Activity: Type.String(),
  Social: Type.String(),
});

export const statusEventResponse = Type.Object({
  Status: Type.String({ default: "OK" }),
});

// Get Event
export const getEventsResponse = Type.Array(
  Type.Object({
    ID: Type.String(),
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

export const getEventResponse = Type.Object({
  ID: Type.String(),
  Name: Type.String(),
  Description: Type.String(),
  Start: Type.String({ format: "date-time" }),
  Finish: Type.String({ format: "date-time" }),
  Public: Type.Boolean(),
  MaxUsers: Type.Number(),
  CurrentUsers: Type.Number(),
  Locale: Type.String(),
  ActivityID: Type.String(),
  Social: Type.String(),
});

export const patchEventBody = Type.Object({
  Name: Type.Optional(Type.String()),
  Description: Type.Optional(Type.String()),
  Start: Type.Optional(Type.String({ format: "date-time" })),
  Finish: Type.Optional(Type.String({ format: "date-time" })),
  Public: Type.Optional(Type.Boolean({ default: EventStatus.PUBLIC })),
  MaxUsers: Type.Optional(Type.Number()),
  CurrentUsers: Type.Optional(Type.Number({ default: 1 })),
  Locale: Type.Optional(Type.String()),
  Activity: Type.Optional(Type.String()),
  Social: Type.Optional(Type.String()),
});

export const eventIdParams = Type.Object({
  eventID: Type.String(),
});

export const userIdParams = Type.Object({
  userID: Type.String(),
});

export const userIdEventIdParams = Type.Object({
  eventID: Type.String({ format: "uuid" }),
  userID: Type.String({ format: "uuid" }),
});
