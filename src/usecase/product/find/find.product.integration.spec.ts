import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";

describe("Caso de uso: Encontrar produto", () => {
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

  it("deve encontrar um produto por id", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const produto = new Product("999", "Notebook", 1452.99);
    await productRepository.create(produto);

    const entrada = { id: "999" };

    const esperado = {
      id: "999",
      name: "Notebook",
      price: 1452.99,
    };

    const resultado = await usecase.execute(entrada);

    expect(resultado).toMatchObject(esperado);
    expect(resultado).toStrictEqual(esperado);
  });

  it("deve lançar erro quando produto não existir", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const entrada = { id: "nao-existe" };

    await expect(usecase.execute(entrada)).rejects.toThrow();
  });
});
