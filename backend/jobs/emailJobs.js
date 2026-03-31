import { emailQueue } from "../queues/emailQueue.js";

export const queueEmail = async ({ to, subject, html }) => {
  await emailQueue.add("sendEmail", {
    to,
    subject,
    html,
  });
};