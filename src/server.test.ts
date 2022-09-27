import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";

import app from "./app";

const request = supertest(app);

test("GET /planets", async () => {
  const planets = [
    {
      id: 1,
      name: "Mercury",
      description: null,
      diamenter: 1234,
      moons: 12,
      createdAt: "2022-09-23T07:19:16.558Z",
      updateAt: "2022-09-23T07:19:00.554Z",
    },
    {
      id: 2,
      name: "Venus",
      description: null,
      diamenter: 5678,
      moons: 2,
      createdAt: "2022-09-23T07:19:49.083Z",
      updateAt: "2022-09-23T07:19:35.986Z",
    },
  ];
  // @ts-ignore
  prismaMock.planet.findMany.mockResolvedValue(planets);

  const response = await request
    .get("/planets")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toEqual(planets);
});
