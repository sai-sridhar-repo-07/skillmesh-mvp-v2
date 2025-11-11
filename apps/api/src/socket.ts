import type { Server } from "socket.io";
import { createAdapter } from "socket.io-redis-adapter";
import { createClient } from "redis";

export async function setupSocket(io: Server) {
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));

  io.of("/presence").on("connection", (socket) => {
    socket.on("presence:online", (payload, cb) => { cb && cb({ ok: true }); });
    socket.on("disconnect", () => {});
  });

  io.of("/session").on("connection", (socket) => {
    socket.on("session:join", ({ sessionId }, cb) => {
      const room = `session:${sessionId}`;
      socket.join(room);
      socket.to(room).emit("session:participant", { id: socket.id, joined: true });
      cb && cb({ joined: true, room });
    });
    socket.on("chat:message", ({ sessionId, text }, cb) => {
      const room = `session:${sessionId}`;
      io.of("/session").to(room).emit("chat:message", { from: socket.id, text, ts: Date.now() });
      cb && cb({ ok: true });
    });
    // WebRTC signaling
    socket.on("webrtc:offer", ({ sessionId, offer }) => {
      socket.to(`session:${sessionId}`).emit("webrtc:offer", { from: socket.id, offer });
    });
    socket.on("webrtc:answer", ({ sessionId, answer }) => {
      socket.to(`session:${sessionId}`).emit("webrtc:answer", { from: socket.id, answer });
    });
    socket.on("webrtc:ice", ({ sessionId, candidate }) => {
      socket.to(`session:${sessionId}`).emit("webrtc:ice", { from: socket.id, candidate });
    });
  });

  io.of("/notify").on("connection", (socket) => {
    // User-specific room would be joined after auth in a real setup.
  });
}
