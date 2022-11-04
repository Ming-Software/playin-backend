import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../Utils/Prisma";
import { patchUserRequest, eventIdParams, eventUserIdParams, pageParams } from "./Contracts";
import { Static, Type } from "@sinclair/typebox";
import Activities from "../../Enums/Activities";
import { UserType } from "@fastify/jwt";
import { User } from ".prisma/client";

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
    let user = await prisma.user.findUnique({ where: { ID: req.user.ID } });

    if (!user) {
      return res.status(500).send(new Error("Email does not exists"));
    }

    if (req.body.Email) {
      const userMail = await prisma.user.findUnique({ where: { Email: req.body.Email } });
      if (userMail) {
        return res.status(500).send(new Error("Email already exists"));
      } else {
        user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Email: req.body.Email } });
      }
    }

    if (req.body.Name) {
      user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Name: req.body.Name } });
    }

    if (req.body.Description) {
      user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Description: req.body.Description } });
    }

    if (req.body.Social) {
      user = await prisma.user.update({ where: { ID: req.user.ID }, data: { Social: req.body.Social } });
    }

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
export const getUsersPageController = async (req: FastifyRequest<{ Params: Static<typeof pageParams> }>, res: FastifyReply) => {
  try {
    const usersPerPage = 30;
    const user = await prisma.user.findMany({ skip: (req.params.page - 1) * usersPerPage, take: usersPerPage });

    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// get all event users
export const getAllEventUsersController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    let users: User[] = [];
    const event = await prisma.event.findUnique({ where: { ID: req.params.eventID } });
    if (!event) return res.status(500).send(new Error("Event doesn't exist"));

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
