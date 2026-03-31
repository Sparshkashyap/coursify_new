import { Worker } from "bullmq";
import connection from "../config/redis.js";
import { sendEmail } from "../utils/sendEmail.js";

console.log("Email worker started...");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      const { to, subject, html } = job.data;

      console.log("Processing email job:", job.id);

      await sendEmail({ to, subject, html });

      console.log("Email sent to:", to);
    } catch (error) {
      console.error("Worker job error:", error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
    lockDuration: 30000,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job failed: ${job?.id}`, err?.message);
});

export default emailWorker;