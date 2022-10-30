import { FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";

import prisma from "../../Utils/Prisma";
import { newEventBody, patchEventBody, eventIdParams } from "./Contracts";
import Activities from "../../Enums/Activities";

export const getEventsController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const allEvents = await prisma.event.findMany();
    const newAllEvents = await Promise.all(
      allEvents.map(async (event) => {
        const activity = await prisma.activity.findUnique({ where: { ID: event.ActivityID } });
        return { ...event, Activity: activity?.Name };
      })
    );
    return res.status(200).send(newAllEvents);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const newEventController = async (req: FastifyRequest<{ Body: Static<typeof newEventBody> }>, res: FastifyReply) => {
  try {
    const activity = await prisma.activity.findUnique({ where: { Name: req.body.Activity } });
    if (activity) {
      await prisma.event.create({
        data: {
          Name: req.body.Name,
          Description: req.body.Description,
          Start: new Date(req.body.Start),
          Locale: req.body.Locale,
          Finish: new Date(req.body.Finish),
          Public: req.body.Public,
          MaxUsers: req.body.MaxUsers,
          CurrentUsers: req.body.CurrentUsers,
          UserID: req.user.ID,
          ActivityID: activity.ID,
          Social: req.body.Social,
        },
      });
    } else return res.status(500).send({ Status: "Unknown Activity" });

    return res.status(200).send({ Status: "Event created with success" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const patchEventController = async (
  req: FastifyRequest<{ Params: Static<typeof eventIdParams>; Body: Static<typeof patchEventBody> }>,
  res: FastifyReply
) => {
  // TODO : Change activity and dates
  try {
    const event = await prisma.event.update({
      data: {
        Name: req.body.Name,
        Description: req.body.Description,
        //Start: req.body.Start,
        Locale: req.body.Locale,
        //Finish: req.body.Finish,
        Public: req.body.Public,
        MaxUsers: req.body.MaxUsers,
        CurrentUsers: req.body.CurrentUsers,
        UserID: req.user.ID,
        //ActivityID: activity?.ID,
        Social: req.body.Social,
      },
      where: { ID: req.params.eventID },
    });
    return res.status(200).send(event);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteEventController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    const event = await prisma.event.findUnique({ where: { ID: req.params.eventID } });
    if (event) {
      if (event.UserID == req.user.ID) {
        await prisma.event.delete({ where: { ID: req.params.eventID } });
        return res.status(200).send({ Status: "Event deleted with success" });
      } else return res.status(500).send({ Status: "Permission Denied" });
    } else return res.status(500).send({ Status: "Event not found" });
  } catch (error) {
    return res.status(500).send({ Status: "Event not deleted" });
  }
};
