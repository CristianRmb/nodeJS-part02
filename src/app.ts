import express from "express";
import "express-async-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

//Add a route to your API that retrieves all resources.
app.get("/planets", async (request, response) => {
  const planets = await prisma.planet.findMany();

  response.json(planets);
});

export default app;
