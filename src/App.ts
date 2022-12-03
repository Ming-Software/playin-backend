import Fastify from "fastify";
import FastifyCORS from "@fastify/cors";
import FastifyJWT from "@fastify/jwt";
import FastifyCookie from "@fastify/cookie";
import FastifyAuth from "@fastify/auth";

import fastifySwagger from "@fastify/swagger";
import FastifySwaggerUi from "@fastify/swagger-ui";

import { verifyJWT } from "./Decorators/JWT";

import authRoutes from "./Features/Auth/Routes";
import userRoutes from "./Features/User/Routes";
// import eventRoutes from "./Features/Event/Routes";
// import guestRoutes from "./Features/Guest/Routes";
// import permissionRoutes from "./Features/Permission/Routes";
// import participantRoutes from "./Features/Participant/Routes";

const buildApp = async () => {
	const app = Fastify();

	// Swagger (Dev Only)
	await app.register(fastifySwagger, { mode: "dynamic" });
	await app.register(FastifySwaggerUi, { routePrefix: "/documentation" });
	app.after(() => console.log("SWAGGER -------> LOADED"));

	// Plugins
	await app.register(FastifyAuth);
	await app.register(FastifyJWT, { secret: String(process.env.ACCESS_SECRET), cookie: { cookieName: "RefreshToken", signed: true } });
	await app.register(FastifyCookie, { secret: process.env.REFRESH_SECRET });
	await app.register(FastifyCORS, { origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://playin.netlify.app"], credentials: true });
	app.after(() => console.log("PLUGINS -------> LOADED"));

	// Decorators
	app.decorate("verifyJWT", verifyJWT);
	app.after(() => console.log("DECORATORS ----> LOADED"));

	// Routes
	await app.register(authRoutes, { prefix: "/api/auth" });
	await app.register(userRoutes, { prefix: "/api/user" });
	app.after(() => console.log("ROUTES --------> LOADED"));

	// The server is ready to be accessed
	app.ready(() => console.log("SERVER --------> LOADED"));
	return app;
};

export default buildApp;
