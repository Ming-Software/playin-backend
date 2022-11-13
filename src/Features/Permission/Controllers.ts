import { FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";

import prisma from "../../Utils/Prisma";
import { eventIdParams } from "./Contracts";

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
    await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } });
    const permission = await prisma.eventPermission.create({ data: { EventID: req.params.eventID, UserID: req.user.ID } });

    return res.status(200).send(permission);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const removePermissionController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    const eventPermission = await prisma.eventPermission.findUniqueOrThrow({
      where: { UserID_EventID: { UserID: req.user.ID, EventID: req.params.eventID } },
    });

    await prisma.eventPermission.delete({ where: { UserID_EventID: { UserID: req.user.ID, EventID: req.params.eventID } } });

    return res.status(200).send({ Status: "Permission deleted with success" });
  } catch (error) {
    return res.status(500).send(error);
  }
};
