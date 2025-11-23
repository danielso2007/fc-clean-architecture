import CreateCustomerUseCase from "./create.product.usecase";

type RepositoryMock = {
  create: jest.Mock;
  findAll: jest.Mock;
  find: jest.Mock;
  update: jest.Mock;
};

const input = {
  name: "John",
  price: 451.87
};

const MockRepository = (): RepositoryMock => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Teste unitário cria caso de uso do produto", () => {
  it("deve criar um produto", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateCustomerUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price
    });
  });

  it("Deveria lançar um erro quando o nome estiver ausente.", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateCustomerUseCase(productRepository);

    input.name = "";

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

});
