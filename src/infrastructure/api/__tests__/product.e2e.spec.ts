import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E: Produto", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("deve criar um produto", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Notebook",
        price: 785.99,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Notebook",
      price: 785.99,
    });
  });

  it("não deve criar produto inválido", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Notebook",
      });

    expect(response.status).toBe(500);
  });

  it("deve listar todos os produtos (JSON e XML)", async () => {
    const r1 = await request(app)
      .post("/product")
      .send({ name: "Notebook", price: 785.99 });
    expect(r1.status).toBe(200);

    const r2 = await request(app)
      .post("/product")
      .send({ name: "PC Gamer", price: 5241.98 });
    expect(r2.status).toBe(200);

    const listResponse = await request(app).get("/product");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products).toHaveLength(2);

    expect(listResponse.body.products[0]).toMatchObject({
      name: "Notebook",
      price: 785.99,
    });

    expect(listResponse.body.products[1]).toMatchObject({
      name: "PC Gamer",
      price: 5241.98,
    });

    const xmlResponse = await request(app)
      .get("/product")
      .set("Accept", "application/xml");

    expect(xmlResponse.status).toBe(200);
    expect(xmlResponse.headers["content-type"]).toMatch(/xml/);

    const xml = xmlResponse.text;

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<products>");
    expect(xml).toContain("<product>");

    expect(xml).toContain("<name>Notebook</name>");
    expect(xml).toContain("<price>785.99</price>");

    expect(xml).toContain("<name>PC Gamer</name>");
    expect(xml).toContain("<price>5241.98</price>");

    expect(xml).toContain("</products>");
  });
});
