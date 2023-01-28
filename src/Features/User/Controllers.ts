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
		for (const item of userActivities) {
			const activity = await prisma.activity.findUnique({ where: { ID: item.ActivityID } });
			if (!activity) continue;
			activities.push(activity?.Name);
		}

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
				data: { UserID: req.user.ID, ActivityID: item.ID },
			});
		}

		return res.status(200).send({ ...user, Activities: activities.map((item) => item.Name) });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get a Page of Users (30 Users per page) with minimal description
export const getUsersPageController = async (
	req: FastifyRequest<{ Querystring: typeof Contracts.GetUsersPageSchema.querystring.static }>,
	res: FastifyReply,
) => {
	try {
		const usersPerPage = 15;

		// We get the page from the db and the total amount of users existing
		const user = await prisma.user.findMany({
			skip: (req.query.Page - 1) * usersPerPage,
			take: usersPerPage,
			orderBy: { CreatedAt: "desc" },
		});
		const total = await prisma.user.count();

		return res.status(200).send({ Users: user, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get a filtered Users with minimal description
export const getUsersFilterController = async (
	req: FastifyRequest<{ Querystring: typeof Contracts.GetUsersFilterSchema.querystring.static }>,
	res: FastifyReply,
) => {
	try {
		// filter of the total amount of users existing
		const users = await prisma.user.findMany({
			where: { Name: { startsWith: req.query.Name } },
		});

		return res.status(200).send({ Users: users });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Get a Page of Users (30 Users per page) with a more detailed description
export const getUsersPageDetailsController = async (
	req: FastifyRequest<{ Querystring: typeof Contracts.GetUsersPageSchema.querystring.static }>,
	res: FastifyReply,
) => {
	try {
		const usersPerPage = 15;

		// We get the page from the db and the total amount of users existing
		const users = await prisma.user.findMany({
			skip: (req.query.Page - 1) * usersPerPage,
			take: usersPerPage,
			orderBy: { CreatedAt: "desc" },
		});
		const total = await prisma.user.count();

		// We now get the activities
		const detailedUsers = [];
		for (const item of users) {
			const activities = await prisma.userActivity.findMany({ where: { UserID: item.ID } });
			const activitiesNames = [];
			for (const itemA of activities) {
				const activity = await prisma.activity.findUnique({ where: { ID: itemA.ActivityID } });
				if (!activity) continue;
				activitiesNames.push(activity.Name);
			}
			detailedUsers.push({ ...item, Activities: activitiesNames });
		}

		return res.status(200).send({ Users: detailedUsers, Total: total });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};
