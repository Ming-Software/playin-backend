import { FastifyRequest, FastifyReply } from "fastify";

// We verify the current accesstToken
export const verifyJWT = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		await req.jwtVerify();
	} catch (error) {
		await res.status(401).send({ ErrorMessage: (error as Error).message });
	}
};
