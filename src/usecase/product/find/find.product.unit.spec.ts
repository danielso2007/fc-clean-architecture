import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

type RepositoryMock = {
  create: jest.Mock;
  findAll: jest.Mock;
  find: jest.Mock;
  update: jest.Mock;
};

const product = new Product("999", "Notebook", 1266.98);

const MockRepository = (): RepositoryMock => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Teste unitário: encontre o caso de uso do produto", () => {
  it("deve encontrar um produto", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: "999",
    };

    const output = {
      id: "999",
      name: "Notebook",
      price: 1266.98
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it("não deve encontrar um produto", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: "123",
    };

    expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
});
