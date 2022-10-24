import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifyAccessJWT: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
  }
}
