import prisma from "../../Utils/Prisma";
import { Static } from "@sinclair/typebox";
import { FastifyRequest, FastifyReply } from "fastify";
import { eventUserIdParams } from "./Contracts";

// Remove a user from an event
export const removeUserEventController = async (req: FastifyRequest<{ Params: Static<typeof eventUserIdParams> }>, res: FastifyReply) => {
  try {
    const userID = await prisma.eventParticipant.delete({
      where: { UserID_EventID: { EventID: req.params.eventID, UserID: req.params.userID } },
    });
    const user = await prisma.user.findUnique({ where: { ID: userID.UserID } });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};
