import { FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";

import prisma from "../../Utils/Prisma";
import { hashPassword, checkPassword } from "../../Utils/Hashing";
import { loginBody, registerBody } from "./Contracts";

export const registerController = async (req: FastifyRequest<{ Body: Static<typeof registerBody> }>, res: FastifyReply) => {
  try {
    // We check to see if the email is unique
    const user = await prisma.user.findUnique({ where: { Email: req.body.Email } });
    if (user) {
      return res.code(500).send(new Error("Email already exists"));
    }
    // We now hash the password and store the user
    const hash = await hashPassword(req.body.Password);
    const newUser = await prisma.user.create({ data: { Email: req.body.Email, Password: hash } });

    return res.code(200).send(newUser);
  } catch (error) {
    return res.code(500).send(error);
  }
};

export const loginController = async (req: FastifyRequest<{ Body: Static<typeof loginBody> }>, res: FastifyReply) => {
  try {
    // We check to see if the email exists
    const user = await prisma.user.findUnique({ where: { Email: req.body.Email } });
    if (!user) {
      return res.code(500).send(new Error("Email does not exists"));
    }
    // We now verify the password
    const isValid = await checkPassword(user.Password, req.body.Password);
    if (!isValid) {
      return res.code(500).send(new Error("Password is not correct"));
    }

    // We create the accessToken (expires in 10 minutes) and the refreshToken (expires in 1 week)
    const accessToken = await res.jwtSign({ ID: user.ID }, { expiresIn: "10m" });
    const refreshToken = await res.jwtSign({ ID: user.ID }, { expiresIn: "1w" });

    // We create a cookie with the refreshToken (secure MUST be true for production)
    res.setCookie("RefreshToken", refreshToken, { path: "/", secure: false, httpOnly: true, sameSite: true, signed: true });

    return res.code(200).send({ AccessToken: accessToken });
  } catch (error) {
    return res.code(500).send(error);
  }
};

export const logoutController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // We just need to clear the refreshToken from the cookies
    res.clearCookie("refreshToken", { path: "/", secure: false, httpOnly: true, sameSite: true, signed: true });
    return res.code(200).send({ Status: "Logout Successfully" });
  } catch (error) {
    return res.code(500).send(error);
  }
};

// We use the refreshToken to generate a new accessToken
export const refreshController = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const decoded: { ID: string } = await req.jwtVerify({ onlyCookie: true });
    const accessToken = await res.jwtSign({ ID: decoded.ID }, { expiresIn: "10m" });

    return res.code(200).send({ Token: accessToken });
  } catch (error) {
    return res.code(500).send(error);
  }
};
