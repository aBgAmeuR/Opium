import "dotenv/config";
import { buildServer } from "./app/server";
import { env } from "./config/env";

const app = buildServer();

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});

module.exports = app;