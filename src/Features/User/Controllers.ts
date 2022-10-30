import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Utils/Prisma";
import { patchUserRequest } from "./Contracts";
import { Static } from "@sinclair/typebox";
import Activities from "../../Enums/Activities";

// Get user Details
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

// Get user
export const getUserController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });

    res.status(200).send({ ...user });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Delete user
export const deleteUserController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = await prisma.user.delete({ where: { ID: req.user.ID } });
    await prisma.userActivity.deleteMany({ where: { UserID: req.user.ID } });

    res.status(200).send({ ...user });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Patch User
export const patchUserController = async (req: FastifyRequest<{ Body: Static<typeof patchUserRequest> }>, res: FastifyReply) => {
  try {
    const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });

    if (!user) {
      return res.status(500).send(new Error("Email does not exists"));
    }

    if (req.body.Email) {
      const userMail = await prisma.user.findUnique({ where: { Email: req.body.Email } });
      if (userMail) {
        return res.status(500).send(new Error("Email already exists"));
      } else {
        const user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Email: req.body.Email } });
      }
    }

    if (req.body.Name) {
      const user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Name: req.body.Name } });
    }

    if (req.body.Description) {
      const user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Description: req.body.Description } });
    }

    if (req.body.Social) {
      const user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Social: req.body.Social } });
    }

    if (req.body.Activities) {
      await prisma.userActivity.deleteMany({ where: { UserID: req.user.ID } });
      const incNone = req.body.Activities.includes(Activities.NONE); // Verifica se o None está pesente
      if (incNone && req.body.Activities.length > 1) {
        const index = req.body.Activities.indexOf(Activities.NONE); // Devolve o indice do None no array
        req.body.Activities.splice(index, 1); // Remove o None
        console.log(req.body.Activities);
      }

      for (let Name of req.body.Activities) {
        const activity = await prisma.activity.findUnique({ where: { Name: Name } });
        // If the activity exists
        if (activity) {
          await prisma.userActivity.create({ data: { UserID: user.ID, ActivityID: activity.ID } });
        }
      }
    }

    const userActivities = await prisma.userActivity.findMany({ where: { UserID: req.user.ID } });
    const activities = await Promise.all(
      userActivities.map(
        async (userActivity) =>
          await prisma.activity.findUnique({ where: { ID: userActivity.ActivityID } }).then((activity) => activity?.Name)
      )
    );

    const userF = await prisma.user.findUnique({ where: { ID: req.user.ID } });
    res.status(200).send({ ...userF, Activities: activities });
  } catch (error) {
    return res.status(500).send(error);
  }
};
