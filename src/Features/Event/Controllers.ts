import { FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";
import prisma from "../../Utils/Prisma";
import { newEventBody, patchEventBody, eventIdParams, userIdParams, getEventsPageQuery } from "./Contracts";

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

export const getEventController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    const event = await prisma.event.findUnique({ where: { ID: req.params.eventID } });
    if (event) {
      const activity = await prisma.activity.findUnique({ where: { ID: event.ActivityID } });
      if (activity) {
        return res.status(200).send({ ...event, Activity: activity.Name });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const newEventController = async (req: FastifyRequest<{ Body: Static<typeof newEventBody> }>, res: FastifyReply) => {
  try {
    const activity = await prisma.activity.findUniqueOrThrow({ where: { Name: req.body.Activity } });
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
    }

    return res.status(200).send({ Status: "Event created with success" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const patchEventController = async (
  req: FastifyRequest<{ Params: Static<typeof eventIdParams>; Body: Static<typeof patchEventBody> }>,
  res: FastifyReply
) => {
  try {
    var finish, activity, startDate;
    if (req.body.Start) {
      startDate = new Date(req.body.Start);
    }
    if (req.body.Finish) {
      finish = new Date(req.body.Finish);
    }
    if (req.body.Activity) {
      activity = await prisma.activity.findUniqueOrThrow({ where: { Name: req.body.Activity } });
    }
    if (activity) {
      const event = await prisma.event.update({
        data: {
          Name: req.body.Name,
          Description: req.body.Description,
          Start: startDate,
          Locale: req.body.Locale,
          Finish: finish,
          Public: req.body.Public,
          MaxUsers: req.body.MaxUsers,
          CurrentUsers: req.body.CurrentUsers,
          UserID: req.user.ID,
          ActivityID: activity.ID,
          Social: req.body.Social,
        },
        where: { ID: req.params.eventID },
      });
      return res.status(200).send(event);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const deleteEventController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
  try {
    const event = await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } });
    if (event) {
      if (event.UserID == req.user.ID) {
        await prisma.event.delete({ where: { ID: req.params.eventID } });
        return res.status(200).send({ Status: "Event deleted with success" });
      } else return res.status(500).send({ Status: "Permission Denied" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getUserEventsController = async (req: FastifyRequest<{ Params: Static<typeof userIdParams> }>, res: FastifyReply) => {
  try {
    const allEvents = await prisma.event.findMany({ where: { UserID: req.params.userID } });
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

export const getEventsPageController = async (
  req: FastifyRequest<{ Querystring: Static<typeof getEventsPageQuery> }>,
  res: FastifyReply
) => {
  try {
    const eventsPerPage = 30;
    const events = await prisma.event.findMany({ skip: (req.query.Page - 1) * eventsPerPage, take: eventsPerPage });
    console.log(events);
    res.status(200).send(events);
  } catch (error) {
    return res.status(500).send(error);
  }
};
