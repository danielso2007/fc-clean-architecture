import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Caso de uso: Criar produto - integração", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    await sequelize.addModels([ProductModel]);
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("deve criar um produto e persistir no repositório", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Monitor",
      price: 899.9,
    };

    const output = await usecase.execute(input);

    expect(output).toHaveProperty("id");
    expect(typeof output.id).toBe("string");
    expect(output).toMatchObject({
      name: "Monitor",
      price: 899.9,
    });

    const persisted = await productRepository.find(output.id);
    expect(persisted).toBeDefined();
    expect(persisted.id).toBe(output.id);
    expect(persisted.name).toBe("Monitor");
    expect(persisted.price).toBe(899.9);
  });
});
