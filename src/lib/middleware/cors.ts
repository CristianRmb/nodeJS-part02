import cors from "cors";

export function initCorsMiddleware() {
  const corsOpions = {
    origin: "http://localhost:8080",
    credentials: true,
  };
  return cors(corsOpions);
}
