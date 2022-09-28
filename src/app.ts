import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import cors from "cors";

import {
  validate,
  validationErrorMiddleware,
  planetSchema,
  PlanetData,
} from "./lib/validation";

const app = express();

const corsOpions = {
  origin: "http://localhost:8080",
};

app.use(express.json());

app.use(cors(corsOpions));
//Add a route to your API that retrieves all resources.
app.get("/planets", async (request, response) => {
  const planets = await prisma.planet.findMany();

  response.json(planets);
});

app.post(
  "/planets",
  validate({ body: planetSchema }),
  async (request, response) => {
    const planet: PlanetData = request.body;

    response.status(201).json(planet);
  }
);

app.get("/planets/:id(\\d+)", async (request, response, next) => {
  const planetID = Number(request.params.id);
  const planet = await prisma.planet.findUnique({
    where: { id: planetID },
  });

  if (!planet) {
    response.status(404);
    return next(`Cannot GET /planets/${planetID}`);
  }
  response.json(planet);
});

app.put(
  "/planets/:id(\\d+)",
  validate({ body: planetSchema }),
  async (request, response, next) => {
    const planetID = Number(request.params.id);

    const planetData: PlanetData = request.body;

    try {
      const planet = await prisma.planet.update({
        //@ts-ignore
        where: { id: Number(request.params.id) },
        data: planetData,
      });

      response.status(200).json(planet);
    } catch (error) {
      response.status(404);
      next(`Cannot PUT /planets/${planetID}`);
    }
  }
);

app.delete("/planets/:id(\\d+)", async (request, response, next) => {
  const planetID = Number(request.params.id);

  try {
    await prisma.planet.delete({
      where: { id: Number(request.params.id) },
    });

    response.status(204).end();
  } catch (error) {
    response.status(404);
    next(`Cannot DELETE /planets/${planetID}`);
  }
});

app.use(validationErrorMiddleware);

export default app;
