import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Caso de uso: Listar produtos - integração", () => {
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

  it("deve listar todos os produtos persistidos", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const p1 = new Product("p-1", "Teclado", 120.5);
    const p2 = new Product("p-2", "Mouse", 45.0);

    await productRepository.create(p1);
    await productRepository.create(p2);

    const output = await usecase.execute();

    expect(output).toHaveProperty("products");
    expect(Array.isArray(output.products)).toBe(true);
    expect(output.products).toHaveLength(2);

    expect(output.products).toEqual(
      expect.arrayContaining([
        { id: "p-1", name: "Teclado", price: 120.5 },
        { id: "p-2", name: "Mouse", price: 45.0 },
      ])
    );
  });
});
