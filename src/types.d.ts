import "fastify";
import "@fastify/jwt";

declare module "fastify" {
	interface FastifyInstance {
		verifyJWT: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: {
			ID: string;
			Name: string;
		};
		user: {
			ID: string;
			Name: string;
		};
	}

	// For now we need this to solve the missing onlyCookie option
	interface VerifyOptions {
		onlyCookie: boolean;
	}
}
