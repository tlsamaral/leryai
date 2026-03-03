import type { FastifyInstance } from "fastify";
import { authenticateWithPassword } from "./routes/authenticate-with-password.js";
import { createAccount } from "./routes/create-account.js";
import { refreshToken } from "./routes/refresh-token.js";

export async function appRoutes(app: FastifyInstance) {
	app.register(authenticateWithPassword);
	app.register(createAccount);
	app.register(refreshToken);
}
