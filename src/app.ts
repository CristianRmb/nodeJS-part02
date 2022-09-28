import express from "express";
import "express-async-errors";

import { validationErrorMiddleware } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";
import planetsRouter from "./routes/planets";

const app = express();

app.use(express.json());

app.use(initCorsMiddleware());

app.use("/planets", planetsRouter);

app.use(validationErrorMiddleware);

export default app;
