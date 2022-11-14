import prisma from "../../Utils/Prisma";
import { Static } from "@sinclair/typebox";
import { FastifyRequest, FastifyReply } from "fastify";
import { userIdEventIdParams } from "../Event/Contracts";
import { eventIdParams } from "../User/Contracts";
import { inviteUserRequest, inviteUsersRequest } from "./Contracts";

// Invite Users
export const inviteUsersController = async (
  req: FastifyRequest<{ Params: Static<typeof eventIdParams>; Body: Static<typeof inviteUsersRequest> }>,
  res: FastifyReply
) => {
  try {
    await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } }); // Verifica se o evento existe
    let usersAddInvites: string[] = [];
    await Promise.all(
      req.body.map(async function (userId) {
        const user = await prisma.user.findUnique({ where: { ID: userId.ID } });
        if (user) {
          await prisma.eventGuest.create({ data: { EventID: req.params.eventID, UserID: userId.ID } });
          usersAddInvites.push(userId.ID);
        }
      })
    );

    return res.status(200).send(usersAddInvites);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Invite Users
export const inviteUserController = async (
  req: FastifyRequest<{ Params: Static<typeof eventIdParams>; Body: Static<typeof inviteUserRequest> }>,
  res: FastifyReply
) => {
  try {
    await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } }); // Verifica se o evento existe
    await prisma.user.findUniqueOrThrow({ where: { ID: req.body.ID } }); // Verifica se o user existe
    await prisma.eventGuest.create({ data: { EventID: req.params.eventID, UserID: req.body.ID } }); // Cria o event guest

    return res.status(200).send(req.body.ID);
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
    await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } }); // Verifica se o evento existe
    const user = await prisma.user.findUniqueOrThrow({ where: { ID: req.params.userID } }); // Verifica se o user existe

    await prisma.eventGuest.delete({ where: { UserID_EventID: { EventID: req.params.eventID, UserID: req.params.userID } } });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getUserInvitationsController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // Definir o array userInvitations
    let userInvitations: {
      ID: string;
      Name: string;
      Description: string;
      Start: Date;
      Finish: Date;
      Public: boolean;
      MaxUsers: number;
      CurrentUsers: number;
      Locale: string;
      Activity: string;
      Social: string;
    }[] = [];

    // Ir buscar todos os eventos do utilizador
    const eventsGuest = await prisma.eventGuest.findMany({ where: { UserID: req.user.ID } });
    await Promise.all(
      eventsGuest.map(async function (eventGuest) {
        const event = await prisma.event.findUnique({ where: { ID: eventGuest.EventID } });
        if (event) {
          // Ir buscar atividade associada ao evento
          const activity = await prisma.activity.findUnique({ where: { ID: event.ActivityID } });
          if (activity) {
            // preencher a variavel com os dados para a response
            const userInvitation = {
              ID: event.ID,
              Name: event.Name,
              Description: event.Description,
              Start: event.Start,
              Finish: event.Finish,
              Public: event.Public,
              MaxUsers: event.MaxUsers,
              CurrentUsers: event.CurrentUsers,
              Locale: event.Locale,
              Activity: activity.Name,
              Social: event.Social,
            };

            // Adicionar ao array
            userInvitations.push(userInvitation);
          }
        }
      })
    );
    return res.status(200).send(userInvitations);
  } catch (error) {
    return res.status(500).send(error);
  }
};
