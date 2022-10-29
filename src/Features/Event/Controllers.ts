import { FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";

import prisma from "../../Utils/Prisma";
import { newEventBody, patchEventBody, patchEventParams } from "./Contracts";
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
    // We connect the user to the activities he shows interest to
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
  req: FastifyRequest<{ Params: Static<typeof patchEventParams>; Body: Static<typeof patchEventBody> }>,
  res: FastifyReply
) => {
  try {
    // We connect the user to the activities he shows interest to
    //const activity = await prisma.activity.findUnique({ where: { Name: req.body.Activity } });
    const event = await prisma.event.update({
      data: {
        Name: req.body.Name,
        Description: req.body.Description,
        Start: req.body.Start,
        Locale: req.body.Locale,
        Finish: req.body.Finish,
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
