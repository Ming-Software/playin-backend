import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Utils/Prisma";

export const getUserController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });
    const activities = await prisma.userActivity.findMany({ where: { UserID: req.user.ID } });
  } catch (error) {
    return res.status(500).send(error);
  }
};
