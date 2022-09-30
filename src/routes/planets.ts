import express, { Router } from "express";
import prisma from "../lib/prisma/client";
import {
  validate,
  planetSchema,
  PlanetData,
} from "../lib/middleware/validation";

import { checkAuthorization } from "../lib/middleware/passport";
import { initMulterMiddleware } from "../lib/middleware/multer";

const upload = initMulterMiddleware();

const router = Router();

//GET generale => tutti i pianeti
router.get("/", async (request, response) => {
  const planets = await prisma.planet.findMany();
  response.json(planets);
});

//GET => pianeta per id
router.get("/:id(\\d+)", async (request, response, next) => {
  // :id(\\d+) => accetta solo numeri se id non è un numero mi da il default error (404)
  //perche mi considera null l'id quindi questo controllo sotto non parte
  const planetID = Number(request.params.id);
  //planetID mi recupera il numero in :id
  const planet = await prisma.planet.findUnique({
    where: { id: planetID },
  });
  //in planet metto il valore corrispondente a pianeta cercato se esiste
  if (!planet) {
    response.status(404);
    return next(`Cannot GET /planets/${planetID}`);
  }
  //l'if eseguito in caso di non corrispondeza del pianeta
  response.json(planet);
  //infine la risposta se tutto è ok
});

//POST => per inserire un pianeta nella lista
router.post(
  "/",
  checkAuthorization,
  validate({ body: planetSchema }),
  async (request, response) => {
    const planetData: PlanetData = request.body;
    const username = request.user?.username as string;

    const planet = await prisma.planet.create({
      //@ts-ignore
      data: { ...planetData, createdBy: username, updatedBy: username },
    });

    response.status(201).json(planet);
  }
);

//PUT => per modificare un pianeta aggiungendo dati
router.put(
  "/:id(\\d+)",
  checkAuthorization,
  validate({ body: planetSchema }),
  async (request, response, next) => {
    const planetID = Number(request.params.id);
    const planetData: PlanetData = request.body;
    const username = request.user?.username as string;
    //try catch per gestire l'errore "Planet does not exist"
    try {
      const planet = await prisma.planet.update({
        where: { id: Number(request.params.id) },
        //@ts-ignore
        data: { ...planetData, createdBy: username, updatedBy: username },
      });
      response.status(200).json(planet);
    } catch (error) {
      response.status(404);
      next(`Cannot PUT /planets/${planetID}`);
    }
  }
);

router.delete(
  "/:id(\\d+)",
  checkAuthorization,
  async (request, response, next) => {
    const planetID = Number(request.params.id);
    //try catch piu semplice perche stiamo semplicemente cancellando dei dati
    try {
      await prisma.planet.delete({
        where: { id: Number(request.params.id) },
      });

      response.status(204).end();
      //.end() indica la fine della risposta dal server
    } catch (error) {
      response.status(404);
      next(`Cannot DELETE /planets/${planetID}`);
    }
  }
);

//per gestire file si usa npm multer (middleware)
router.post(
  "/:id(\\d+)/photo",
  checkAuthorization,
  upload.single("photo"),
  async (request, response, next) => {
    if (!request.file) {
      response.status(400);
      return next("No photo file upoloaded");
    }
    const planetID = Number(request.params.id);
    const photoFilename = request.file.filename;

    try {
      await prisma.planet.update({
        where: { id: planetID },
        data: { photoFilename },
      });
      response.status(201).json({ photoFilename });
    } catch (error) {
      response.status(404);
      next(`Cannot POST /planets/${planetID}/photo`);
    }
  }
);

router.use("/photo", express.static("uploads"));

export default router;
