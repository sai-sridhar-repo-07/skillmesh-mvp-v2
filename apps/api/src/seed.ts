import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User";
import Session from "./models/Session";
import bcrypt from "bcryptjs";

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);

  const passwordHash = await bcrypt.hash("password123", 12);
  const u1 = await User.create({ name: "Alice Mentor", email: "alice@example.com", passwordHash, roles: ["mentor"] , skills:["JS","React"], tags:["frontend","web"]});
  const u2 = await User.create({ name: "Bob Learner", email: "bob@example.com", passwordHash, roles: ["learner"], skills:["Python"], tags:["data"]});

  await Session.create({
    hostId: u1.id, topic: "Intro to React in 15 minutes",
    tags: ["react","frontend"], mode: "instant", priceCredits: 2, maxParticipants: 1, description: "Quickstart React"
  });

  console.log("Seeded users:", u1.email, u2.email);
  await mongoose.disconnect();
}

main().catch(console.error);
