import prisma from "../../Utils/Prisma";
import { Static } from "@sinclair/typebox";
import { FastifyRequest, FastifyReply } from "fastify";
import { userIdEventIdParams } from "../Event/Contracts";
import { eventIdParams } from "../User/Contracts";
import { inviteUsersRequest } from "./Contracts";

// Invite Users
// Mudar para so um utilizador
export const inviteUsersController = async (
  req: FastifyRequest<{ Params: Static<typeof eventIdParams>; Body: Static<typeof inviteUsersRequest> }>,
  res: FastifyReply
) => {
  try {
    const event = await prisma.event.findUnique({ where: { ID: req.params.eventID } });
    if (!event) return res.status(500).send(new Error("Event doesn't exist"));
    let usersAddInvites: string[] = [];
    await Promise.all(
      req.body.map(async function (userId) {
        const user = await prisma.user.findUnique({ where: { ID: userId } });
        if (user) {
          await prisma.eventGuest.create({ data: { EventID: req.params.eventID, UserID: userId } });
          usersAddInvites.push(userId);
        }
      })
    );

    return res.status(200).send(usersAddInvites);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Remove an invite from an event
export const removeInviteUsersController = async (
  req: FastifyRequest<{ Params: Static<typeof userIdEventIdParams> }>,
  res: FastifyReply
) => {
  try {
    const event = await prisma.event.findUnique({ where: { ID: req.params.eventID } });
    if (!event) return res.status(500).send(new Error("Event doesn't exist"));

    const user = await prisma.user.findUnique({ where: { ID: req.params.userID } });
    if (!user) return res.status(500).send(new Error("User doesn't exist"));

    await prisma.eventGuest.delete({ where: { UserID_EventID: { EventID: req.params.eventID, UserID: req.params.userID } } });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};
