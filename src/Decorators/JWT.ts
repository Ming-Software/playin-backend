import { FastifyRequest, FastifyReply } from "fastify";

// We verify the current accesstToken
export const verifyAccessJWT = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    await req.jwtVerify();
  } catch (error) {
    res.code(401).send(error);
  }
};
