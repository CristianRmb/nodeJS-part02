import supertest from "supertest";
import { prismaMock } from "../lib/prisma/client.mock";
import app from "../app";

const request = supertest(app);

describe("GET /planets", () => {
  test("Valid request", async () => {
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
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");

    expect(response.body).toEqual(planets);
  });
});

describe("POST /planets", () => {
  test("Valid request", async () => {
    const planet = {
      id: 3,
      name: "Mercury",
      description: null,
      diameter: 1234,
      moons: 12,
      createdAt: "2022-09-23T14:21:30.558Z",
      updateAt: "2022-09-23T14:21:30.568Z",
    };

    // @ts-ignore
    prismaMock.planet.create.mockResolvedValue(planet);

    const response = await request
      .post("/planets")
      .send({
        name: "Mercury",
        diameter: 1234,
        moons: 12,
      })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");

    expect(response.body).toEqual(planet);
  });

  test("Invalid request", async () => {
    const planet = {
      diamenter: 1234,
      moons: 12,
    };

    const response = await request
      .post("/planets")
      .send(planet)
      .expect(422)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });
});

describe("GET /planet/:id", () => {
  test("Valid request", async () => {
    const planet = {
      id: 1,
      name: "Mercury",
      description: null,
      diameter: 1234,
      moons: 12,
      createdAt: "2022-09-23T14:06:25.350Z",
      updateAt: "2022-09-23T14:05:20.848Z",
    };
    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(planet);

    const response = await request
      .get("/planets/1")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(planet);
  });

  test("Planet does not exist", async () => {
    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(null);

    const response = await request
      .get("/planets/23")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot GET /planets/23");
  });

  test("Invalid planet ID", async () => {
    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(null);

    const response = await request
      .get("/planets/asdf")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot GET /planets/asdf");
  });
});

describe("PUT /planets/:id", () => {
  test("Valid request", async () => {
    const planet = {
      id: 3,
      name: "Mercury",
      description: "Lovely planet",
      diameter: 1234,
      moons: 12,
      createdAt: "2022-09-23T14:21:30.558Z",
      updateAt: "2022-09-23T14:21:30.568Z",
    };
    // @ts-ignore
    prismaMock.planet.update.mockResolvedValue(planet);
    const response = await request
      .put("/planets/3")
      .send({
        name: "Mercury",
        description: "Lovely planet",
        diameter: 1234,
        moons: 12,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");

    expect(response.body).toEqual(planet);
  });

  test("Invalid request", async () => {
    const planet = {
      diamenter: 1234,
      moons: 12,
    };

    const response = await request
      .put("/planets/23")
      .send(planet)
      .expect(422)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });

  test("Planet does not exist", async () => {
    // @ts-ignore
    prismaMock.planet.update.mockRejectedValue(new Error("Error"));
    const response = await request
      .put("/planets/23")
      .send({
        name: "Mercury",
        description: "Lovely planet",
        diameter: 1234,
        moons: 12,
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot PUT /planets/23");
  });

  test("Invalid planet ID", async () => {
    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(null);

    const response = await request
      .put("/planets/asdf")
      .send({
        name: "Mercury",
        description: "Lovely planet",
        diameter: 1234,
        moons: 12,
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot PUT /planets/asdf");
  });
});

describe("DELETE /planet/:id", () => {
  test("Valid request", async () => {
    const response = await request
      .delete("/planets/1")
      .expect(204)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");

    expect(response.text).toEqual("");
  });

  test("Planet does not exist", async () => {
    // @ts-ignore
    prismaMock.planet.delete.mockRejectedValue(new Error("Error"));

    const response = await request
      .delete("/planets/23")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot DELETE /planets/23");
  });

  test("Invalid planet ID", async () => {
    const response = await request
      .delete("/planets/asdf")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot DELETE /planets/asdf");
  });
});

describe("POST /planets/:id/photo", () => {
  test("Valid request with PNG file upload", async () => {
    await request
      .post("/planets/23/photo")
      .attach("photo", "test-fixtures/photos/file.png")
      .expect(201)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");
  });

  test("Valid request with JPG file upload", async () => {
    await request
      .post("/planets/23/photo")
      .attach("photo", "test-fixtures/photos/file.jpg")
      .expect(201)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");
  });

  test("Invalid request with text file upload", async () => {
    const response = await request
      .post("/planets/23/photo")
      .attach("photo", "test-fixtures/photos/file.txt")
      .expect(500)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain(
      "Error: The ulpoaded file must be a JPG or a PNG image."
    );
  });

  test("Invalid planet ID", async () => {
    const response = await request
      .post("/planets/asdf/photo")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot POST /planets/asdf/photo");
  });

  test("Valid request with no file upload", async () => {
    const response = await request
      .post("/planets/23/photo")
      .expect(400)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("No photo file upoloaded");
  });

  test("Planet does not exist", async () => {
    //@ts-ignore
    prismaMock.planet.update.mockRejectedValue(new Error("Error"));

    const response = await request
      .post("/planets/23/photo")
      .attach("photo", "test-fixtures/photos/file.png")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toContain("Cannot POST /planets/23/photo");
  });
});
