import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Utils/Prisma";
import { patchUserRequest, eventIdParams, pageQuery } from "./Contracts";
import { Static } from "@sinclair/typebox";
import { User } from ".prisma/client";
import Activities from "../../Enums/Activities";

// Get user Details
export const getUserDetailsController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { ID: req.user.ID } });
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
    const user = await prisma.user.findUniqueOrThrow({ where: { ID: req.user.ID } });

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
    if (req.body.Email) {
      const userMail = await prisma.user.findUnique({ where: { Email: req.body.Email } });
      if (userMail) {
        return res.status(500).send(new Error("Email already exists"));
      }
    }
    // Update da tabela User
    const user = await prisma.user.update({
      data: {
        Email: req.body.Email,
        Name: req.body.Name,
        Description: req.body.Description,
        Social: req.body.Social,
      },
      where: { ID: req.user.ID },
    });

    // Update da tabela Activity
    let activities = [];
    if (req.body.Activities) {
      await prisma.userActivity.deleteMany({ where: { UserID: req.user.ID } }); // Remove todos os elementos
      const incNone = req.body.Activities.includes(Activities.NONE); // Verifica se o None está pesente
      if (incNone && req.body.Activities.length > 1) {
        const index = req.body.Activities.indexOf(Activities.NONE); // Devolve o indice do None no array
        req.body.Activities.splice(index, 1); // Remove o None
      }

      for (let Name of req.body.Activities) {
        const activity = await prisma.activity.findUnique({ where: { Name: Name } });
        // If the activity exists
        if (activity) {
          await prisma.userActivity.create({ data: { UserID: user.ID, ActivityID: activity.ID } });
          activities.push(activity.Name);
        }
      }
    }

    res.status(200).send({ ...user, Activities: activities });
  } catch (error) {
    return res.status(500).send(error);
  }
};

//getUsersPage
export const getUsersPageController = async (req: FastifyRequest<{ Querystring: Static<typeof pageQuery> }>, res: FastifyReply) => {
  try {
    const usersPerPage = 30;
    const user = await prisma.user.findMany({ skip: (req.query.Page - 1) * usersPerPage, take: usersPerPage });

    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// get all event users
export const getAllEventUsersController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    let users: User[] = [];
    const event = await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } });

    const usersIDs = await prisma.eventParticipant.findMany({ where: { EventID: req.params.eventID } });
    await Promise.all(
      usersIDs.map(async function (userId) {
        const user = await prisma.user.findUnique({ where: { ID: userId.UserID } });
        if (user) {
          users.push(user);
        }
      })
    );

    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send(error);
  }
};
