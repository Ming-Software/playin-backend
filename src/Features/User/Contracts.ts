import { Type } from "@sinclair/typebox";
import EventStatus from "../../Enums/Event";

// get user details
export const getUserDetailsResponse = Type.Object({
  Email: Type.String({ format: "email" }),
  Name: Type.String(),
  Description: Type.String(),
  Social: Type.String(),
  Activities: Type.Array(Type.String()),
  Admin: Type.Boolean(),
});

// get user
export const getUserResponse = Type.Object({
  Email: Type.String({ format: "email" }),
  Name: Type.String(),
  Description: Type.String(),
});

// delete user
export const deleteUserResponse = Type.Object({
  Email: Type.String({ format: "email" }),
  Name: Type.String(),
});

// patch user
export const patchUserRequest = Type.Object({
  Email: Type.Optional(Type.String()),
  Name: Type.Optional(Type.String()),
  Description: Type.Optional(Type.String()),
  Social: Type.Optional(Type.String()),
  Activities: Type.Optional(Type.Array(Type.String())),
});

export const patchUserResponse = Type.Object({
  Email: Type.String({ format: "email" }),
  Name: Type.String(),
  Description: Type.String(),
  Social: Type.String(),
  Activities: Type.Array(Type.String()),
});

// Get Users with page query
export const getUsersPageResponse = Type.Array(
  Type.Object({
    ID: Type.String(),
    Name: Type.String(),
    Description: Type.String(),
  })
);

export const pageParams = Type.Object({
  page: Type.Number(),
});

// get all event users
export const getAllEventUsers = Type.Array(
  Type.Object({
    ID: Type.String(),
    Name: Type.String(),
    Description: Type.String(),
  })
);

export const eventIdParams = Type.Object({
  eventID: Type.String(),
});
