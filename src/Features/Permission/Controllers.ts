import { FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";

import prisma from "../../Utils/Prisma";
import { acceptPermissionParams, eventIdParams } from "./Contracts";

export const getEventPermissions = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const allPermissions = await prisma.eventPermission.findMany({ where: { UserID: req.user.ID } });
    return res.status(200).send(allPermissions);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const sendPermissionController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    const event = await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } });
    if (event) {
      const permission = await prisma.eventPermission.create({ data: { EventID: req.params.eventID, UserID: req.user.ID } });
      return res.status(200).send(permission);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Isto não está completo
// Se calhar é melhor fazer uma segunda função que deixe apagar do lado do dono do evento. Esta só deixa quem fez o pedido
export const removePermissionController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    const eventPermission = await prisma.eventPermission.findUniqueOrThrow({
      where: { UserID_EventID: { UserID: req.user.ID, EventID: req.params.eventID } },
    });
    if (eventPermission) {
      await prisma.eventPermission.delete({ where: { UserID_EventID: { UserID: req.user.ID, EventID: req.params.eventID } } });
      return res.status(200).send({ Status: "Permission deleted with success" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const acceptPermissionController = async (
  req: FastifyRequest<{ Params: Static<typeof acceptPermissionParams> }>,
  res: FastifyReply
) => {
  try {
    // We get the permission we want to accept
    const eventPermission = await prisma.eventPermission.findUnique({
      where: { UserID_EventID: { UserID: req.params.UserID, EventID: req.params.EventID } },
    });
    if (!eventPermission) {
      return res.status(500).send(new Error("Permission does not exist"));
    }

    // We get both the event and the user
    const user = await prisma.user.findUnique({ where: { ID: eventPermission.UserID } });
    const event = await prisma.event.findUnique({ where: { ID: eventPermission.UserID } });
    if (!event || !user) {
      return res.status(500).send(new Error("Event or user does not exist"));
    }

    // We must make sure that the user about to accept the request is the one that owns the event
    if (event.UserID !== req.user.ID) {
      return res.status(500).send(new Error("User does not onw the event"));
    }

    // If everything until now is ok we should delete the permission and create a new participant
    await prisma.eventPermission.delete({ where: { UserID_EventID: { UserID: req.params.UserID, EventID: req.params.EventID } } });
    await prisma.eventParticipant.create({ data: { EventID: event.ID, UserID: user.ID } });

    return res.status(200).send({ Status: "Permissions Accepted successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
};
