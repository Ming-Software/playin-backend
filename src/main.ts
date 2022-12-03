import "dotenv/config";
import buildApp from "./App";

const main = async () => {
	const app = await buildApp();
	await app.listen({ port: Number(process.env.PORT), host: "0.0.0.0" });
};

main()
	.then(() => console.log(`Server ready at http://localhost:${process.env.PORT}`))
	.catch(() => console.error);
