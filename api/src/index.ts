import * as Hapi from "@hapi/hapi";
import getRoutes from "./routes";
import Mongoose from "mongoose";
import validate from "./auth/validation";
import { options } from "./config";

const HOST = process.env.API_HOST || "0.0.0.0";
const PORT = process.env.API_PORT || 5000;
const DATABASE = process.env.DATABASE || "mongodb://mongo:27017/local"; // todo: dockerize
console.log(DATABASE);
Mongoose.connect(DATABASE);

const server: Hapi.Server = new Hapi.Server({ host: HOST, port: PORT, "routes":{"cors":true} });

async function start(): Promise<void> {
  try {
    await server.register({
      plugin: require("good"),
      options
    });

    await server.register({
      plugin: require("hapi-pino"),
      options: {
        prettyPrint: process.env.NODE_ENV !== "production",
        // Redact Authorization headers, see https://getpino.io/#/docs/redaction
        redact: ["req.headers.authorization"]
      }
    });

    await server.register([require("hapi-auth-jwt2")]);
    server.auth.strategy("jwt", "jwt", {
      // todo: hide this somehow, is in one other place
      key:
        "HaFwVcntGquwlJkFY5VU4kan0TKkT2mnBTJ381drEyoiShvBQKh4VJbbc+y8Oezv20QdLHGJBC3LLDvjPKu4rwa6Zv9FPrsqRQh/j+Z0G/8GyollQjZGUAJJoLb2FfAdBpuGM+AxWh54iQJos4+t49mO8BGh5CmnMEK+9QYIkiG84BQEiQ+uviQFHoPQ57P/vO6CW25Xu2JCBR2DIp4Z7wcXe8yPU0RPz9WH6sEiQdnShMg4glWSq5oiuWIWsCrZwxIC263Mz6Cs89h79RIC5J0lQFYGTdkOGHNe9NORihDvRrraReCohIBxVonVLQqxH/wtgGyIKyWZgHufNidofA==", // Never Share your secret key todo: change
      validate // validate function defined above
    });

    server.auth.default("jwt");

    getRoutes(server);

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server running @ ${server.info.uri}`);
}

start();
