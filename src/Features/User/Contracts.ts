import { Type } from "@sinclair/typebox";
import Social from "../../Enums/Social";
import Admin from "../../Enums/Admin";
import Activities from "../../Enums/Activities";

// get user
export const getUserResponse = Type.Object({
  Email: Type.String({ format: "email" }),
  Name: Type.String(),
  Description: Type.String(),
  Social: Type.String(),
  Activities: Type.Array(Type.String()),
  Admin: Type.Boolean(),
});
