import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Caso de uso: Atualizar produto - integração", () => {
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

  it("deve atualizar um produto existente e persistir as mudanças", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const original = new Product("123", "Mouse Gamer", 250);
    await productRepository.create(original);

    const input = {
      id: "123",
      name: "Mouse Gamer RGB",
      price: 299.9,
    };

    const output = await usecase.execute(input);

    expect(output).toMatchObject({
      id: "123",
      name: "Mouse Gamer RGB",
      price: 299.9,
    });

    const persisted = await productRepository.find("123");

    expect(persisted.id).toBe("123");
    expect(persisted.name).toBe("Mouse Gamer RGB");
    expect(persisted.price).toBe(299.9);
  });

  it("deve lançar erro ao tentar atualizar produto inexistente", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "nao-existe",
      name: "Qualquer",
      price: 50,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Product not found");
  });
});
