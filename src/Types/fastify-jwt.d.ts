import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { ID: string };
    user: { ID: string };
  }

  // For now we need this to solve the missing onlyCookie option
  interface VerifyOptions {
    onlyCookie: boolean;
  }
}
