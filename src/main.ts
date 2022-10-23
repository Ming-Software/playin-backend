require("dotenv").config();
import buildApp from "./App";

const run = async () => {
  try {
    const app = buildApp();
    await app.listen({ port: Number(process.env.PORT), host: "0.0.0.0" });
    console.log(`Server ready at http://localhost:${process.env.PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
