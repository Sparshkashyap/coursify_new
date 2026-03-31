import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let connection;

if (process.env.REDIS_URL) {
  console.log("Using Upstash Redis...");

  connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 10000,
  });

  connection.on("connect", () => {
    console.log("Redis connected");
  });

  connection.on("ready", () => {
    console.log("Redis ready");
  });

  connection.on("error", (err) => {
    console.error("Redis error:", err.message);
  });

} else {
  console.log("Using Local Redis...");

  connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
  });
}

export default connection;