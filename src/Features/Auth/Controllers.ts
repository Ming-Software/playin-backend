import { FastifyRequest, FastifyReply } from "fastify";

import prisma from "../../Utils/Prisma";
import * as Hashing from "../../Utils/Hashing";
import * as Contracts from "./Contracts";
import ACTIVITIES from "../../Enums/Activities";

// Register a New User
export const registerController = async (
	req: FastifyRequest<{ Body: typeof Contracts.RegisterSchema.body.static }>,
	res: FastifyReply,
) => {
	try {
		// We check to see if the email is unique
		const user = await prisma.user.findUnique({ where: { Email: req.body.Email } });
		if (user) throw new Error("User already exists");

		// We now hash the password and store the user
		const hash = await Hashing.hashPassword(req.body.Password);
		const newUser = await prisma.user.create({
			data: { Email: req.body.Email, Password: hash, Name: req.body.Name, Social: req.body.Social },
		});

		// We connect the user to the activities he shows interest to
		for (const Name of req.body.Activities) {
			// We find the activity he likes and if the activity does not exist we skip this iteration
			const activity = await prisma.activity.findUnique({ where: { Name: Name } });
			if (!activity) continue;

			// We create the UserActivity and if it is a NONE we delete every other activity and stop this for
			await prisma.userActivity.create({ data: { UserID: newUser.ID, ActivityID: activity.ID } });
			if (activity.Name === ACTIVITIES.NONE) {
				await prisma.userActivity.deleteMany({ where: { NOT: { ActivityID: activity.ID } } });
				break;
			}
		}

		return res.status(200).send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Login a User
export const loginController = async (
	req: FastifyRequest<{ Body: typeof Contracts.LoginSchema.body.static }>,
	res: FastifyReply,
) => {
	try {
		// We check to see if the email exists
		const user = await prisma.user.findUnique({ where: { Email: req.body.Email } });
		if (!user) throw new Error("Email does not exists");

		// We now verify the password
		const isValid = await Hashing.checkPassword(user.Password, req.body.Password);
		if (!isValid) throw new Error("Password is not correct");

		// We create the accessToken (expires in 10 minutes) and the refreshToken (expires in 1 week)
		// To test this out on the frontend for the time being we will have 10 seconds for access and 20 seconds for refresh
		const accessToken = await res.jwtSign({ ID: user.ID, Name: user.Name }, { expiresIn: "10m" });
		const refreshToken = await res.jwtSign({ ID: user.ID, Name: user.Name }, { expiresIn: "1w" });

		// We create a cookie with the refreshToken (secure MUST be true for production)
		return res
			.setCookie("RefreshToken", refreshToken, { path: "/", secure: true, httpOnly: true, sameSite: "none", signed: true })
			.status(200)
			.send({ AccessToken: accessToken });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Logout a User
export const logoutController = async (_req: FastifyRequest, res: FastifyReply) => {
	try {
		// We just need to clear the refreshToken from the cookies
		return res
			.clearCookie("RefreshToken", { path: "/", secure: true, httpOnly: true, sameSite: "none", signed: true })
			.status(200)
			.send({});
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};

// Generate new AccessToken using RefreshToken
export const refreshController = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		// We verify the RefreshToken and if valid create a new AccessToken
		const decoded: { ID: string; Name: string } = await req.jwtVerify({ onlyCookie: true });
		const accessToken = await res.jwtSign({ ID: decoded.ID, Name: decoded.Name }, { expiresIn: "10m" });

		return res.status(200).send({ AccessToken: accessToken });
	} catch (error) {
		return res.status(500).send({ ErrorMessage: (error as Error).message });
	}
};
