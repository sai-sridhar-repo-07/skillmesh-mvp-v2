import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import http from "node:http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import analyticsRoutes from "./routes/analytics";
import userRoutes from "./routes/users";
import sessionRoutes from "./routes/sessions";
import walletRoutes from "./routes/wallet";
import ratingRoutes from "./routes/ratings";
import notificationRoutes from "./routes/notifications";
import whiteboardRoutes from "./routes/whiteboard";
import fileRoutes from "./routes/files";
import matchRoutes from "./routes/match";
import { setupSocket } from "./socket";
import passport from "./passport";
import { initCron } from "./cron";
import { rateLimit } from "./middleware/rateLimit";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use((req:any,res,next)=>{ if (req.path === "/api/wallet/webhook/stripe") { req.setEncoding("utf8"); let data=""; req.on("data", (c)=>data+=c); req.on("end", ()=>{ req.rawBody=data; next(); }); } else { express.json({ limit: "1mb" })(req,res,next); } });
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(rateLimit);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/whiteboard", whiteboardRoutes);

// Swagger stub (could be extended to full OpenAPI JSON)
import swaggerUi from "swagger-ui-express";
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup({ openapi: "3.0.0", info: { title: "SkillMesh API (MVP)", version: "0.1.0" } }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN } });
setupSocket(io);

async function start() {
  await mongoose.connect(process.env.MONGO_URI!);
  server.listen(process.env.PORT || 8080, () => { initCron();
    console.log("API listening on", process.env.PORT || 8080);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
