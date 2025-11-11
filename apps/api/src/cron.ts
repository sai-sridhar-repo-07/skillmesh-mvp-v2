import cron from "node-cron";
import Session from "./models/Session";
import User from "./models/User";
import { sendEmail, templates } from "./utils/mailer";

export function initCron() {
  // Every minute, find sessions scheduled within next 10 minutes and not yet reminded.
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const soon = new Date(now.getTime() + 10 * 60 * 1000);
    const sessions = await Session.find({
      status: "scheduled",
      startedAt: { $gte: now, $lte: soon }
    }).limit(50);
    for (const s of sessions) {
      const host = await User.findById(s.hostId);
      if (host?.email) {
        await sendEmail(host.email, "Your SkillMesh session starts soon", templates.sessionReminder(host.name, s.topic, s.startedAt?.toISOString() || ""));
      }
    }
  });
}
