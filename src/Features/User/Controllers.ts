import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Utils/Prisma";

export const getUserDetailsController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });
    const userActivities = await prisma.userActivity.findMany({ where: { UserID: req.user.ID } });

    const activities = await Promise.all(
      userActivities.map(
        async (userActivity) =>
          await prisma.activity.findUnique({ where: { ID: userActivity.ActivityID } }).then((activity) => activity?.Name)
      )
    );

    res.status(200).send({ ...user, Activities: activities });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getUserController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });

    res.status(200).send({ ...user });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteUserController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = await prisma.user.delete({ where: { ID: req.user.ID } });
    await prisma.userActivity.deleteMany({ where: { UserID: req.user.ID } });

    res.status(200).send({ ...user });
  } catch (error) {
    return res.status(500).send(error);
  }
};
