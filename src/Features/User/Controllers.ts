import { FastifyReply, FastifyRequest } from "fastify";

import prisma from "../../Utils/Prisma";
import * as Contracts from "./Contracts";
import Activities from "../../Enums/Activities";

// Get Signed In User
export const getSignedInUserController = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		// We look for the user and if it does not exist there is an error
		const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });
		if (!user) throw new Error("User does not exists");

		return res.status(200).send(user);
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get Signed In User Details
export const getSignedInUserDetailsController = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		// We look for the user and if it does not exist there is an error
		const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });
		if (!user) throw new Error("User does not exists");

		// We get the activities the user likes to do
		const userActivities = await prisma.userActivity.findMany({ where: { UserID: req.user.ID } });
		const activities = [];
		for (const item of userActivities) activities.push(item.ActivityName);

		return res.status(200).send({ ...user, Activities: activities });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Delete Signed In User
export const deleteSignedInUserController = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		// We look for the user and if it does not exist there is an error
		const user = await prisma.user.findUnique({ where: { ID: req.user.ID } });
		if (!user) throw new Error("User does not exists");

		// We delete the user
		await prisma.user.delete({ where: { ID: req.user.ID } });

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Update Signed In User
export const patchUserController = async (
	req: FastifyRequest<{ Body: typeof Contracts.UpdateSignedInUserSchema.body.static }>,
	res: FastifyReply,
) => {
	try {
		// If the email is something the user wants to change we must verify it is unique
		if (req.body.Email) {
			const userMail = await prisma.user.findUnique({ where: { Email: req.body.Email } });
			if (userMail) throw new Error("Email already exists");
		}

		// If the activities is something the user wants to change
		const activities = [];
		if (req.body.Activities) {
			// Now we go through the activities received and add them one by one
			for (const Name of req.body.Activities) {
				// We find the new activity and if it does not exist we skip this iteration
				const activity = await prisma.activity.findUnique({ where: { Name: Name } });
				if (!activity) continue;
				activities.push({ ID: activity.ID, Name: activity.Name });

				// If it is a NONE we delete every other activity and stop this loop
				if (activity.Name === Activities.NONE) {
					while (activities.length > 0) activities.pop();
					activities.push({ ID: activity.ID, Name: activity.Name });
					break;
				}
			}

			// We must verify that the array is not empty
			if (activities.length === 0) throw new Error("No activities have been selected");
		}

		// Then we update the User table with the existing properties
		const user = await prisma.user.update({
			data: { Email: req.body.Email, Name: req.body.Name, Description: req.body.Description, Social: req.body.Social },
			where: { ID: req.user.ID },
		});

		// Then we update the UserActivity table
		await prisma.userActivity.deleteMany({ where: { UserID: req.user.ID } });
		for (const item of activities) {
			await prisma.userActivity.create({
				data: { UserID: req.user.ID, UserName: req.user.Name, ActivityID: item.ID, ActivityName: item.Name },
			});
		}

		return res.status(200).send({ ...user, Activities: activities.map((item) => item.Name) });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

//getUsersPage
export const getUsersPageController = async (
	req: FastifyRequest<{ Querystring: typeof Contracts.GetUsersPageSchema.querystring.static }>,
	res: FastifyReply,
) => {
	try {
		const usersPerPage = 30;
		const user = await prisma.user.findMany({ skip: (req.query.Page - 1) * usersPerPage, take: usersPerPage });
		const total = await prisma.user.count();
		return res.status(200).send({ Users: user, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// // get all event users
// export const getAllEventUsersController = async (req: FastifyRequest<{ Params: Static<typeof eventIdParams> }>, res: FastifyReply) => {
// 	try {
// 		let users: User[] = [];
// 		await prisma.event.findUniqueOrThrow({ where: { ID: req.params.eventID } }); // Verifica se evento existe

// 		const usersIDs = await prisma.eventParticipant.findMany({ where: { EventID: req.params.eventID } });
// 		await Promise.all(
// 			usersIDs.map(async function (userId) {
// 				const user = await prisma.user.findUnique({ where: { ID: userId.UserID } });
// 				if (user) {
// 					users.push(user);
// 				}
// 			}),
// 		);

// 		return res.status(200).send(users);
// 	} catch (error) {
// 		return res.status(500).send(error);
// 	}
// };
