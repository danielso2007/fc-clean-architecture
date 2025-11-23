import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

type RepositoryMock = {
  create: jest.Mock<Promise<void>, [any]>;
  findAll: jest.Mock<Promise<any[]>, []>;
  find: jest.Mock<Promise<any | null>, [string]>;
  update: jest.Mock<Promise<void>, [any]>;
};

const produto = ProductFactory.create("a", "Notebook", 1221.98);

const entradaValida = {
  id: produto.id,
  name: "Notebook Gamer",
  price: 8452.98,
};

const MockRepository = (found = true): RepositoryMock => ({
  create: jest.fn(),
  findAll: jest.fn(),
  find: jest.fn().mockResolvedValue(found ? produto : null),
  update: jest.fn().mockResolvedValue(undefined),
});

describe("Caso de uso: Atualizar produto", () => {
  let repository: RepositoryMock;
  let usecase: UpdateProductUseCase;

  beforeEach(() => {
    repository = MockRepository(true);
    usecase = new UpdateProductUseCase(repository);
  });

  beforeEach(() => {
    jest.resetModules();
  });

  it("deve atualizar um produto existente e retornar os dados atualizados", async () => {
    const resultado = await usecase.execute(entradaValida);

    expect(repository.find).toHaveBeenCalledWith(entradaValida.id);
    expect(repository.update).toHaveBeenCalledTimes(1);

    expect(resultado).toMatchObject({
      id: entradaValida.id,
      name: entradaValida.name,
      price: entradaValida.price,
    });
  });

  it("deve lançar erro quando o produto não existir", async () => {
    repository = MockRepository(false);
    usecase = new UpdateProductUseCase(repository);

    await expect(usecase.execute(entradaValida)).rejects.toThrow();
    expect(repository.find).toHaveBeenCalledWith(entradaValida.id);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deve validar o contrato do DTO de saída (campos e tipos)", async () => {
    const resultado = await usecase.execute(entradaValida);

    expect(resultado).toHaveProperty("id");
    expect(resultado).toHaveProperty("name");
    expect(resultado).toHaveProperty("price");
    expect(typeof resultado.id).toBe("string");
    expect(typeof resultado.name).toBe("string");
    expect(typeof resultado.price).toBe("number");
  });

  it("deve lançar erro ao atualizar com nome vazio", async () => {
    const entrada = { ...entradaValida, name: "" };

    await expect(usecase.execute(entrada)).rejects.toThrow();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("deve alterar o nome da entidade antes de chamar update()", async () => {
    await usecase.execute(entradaValida);

    const entidade = repository.update.mock.calls[0][0];
    expect(entidade.name).toBe(entradaValida.name);
  });

  it("deve alterar o preço antes de persistir", async () => {
    await usecase.execute(entradaValida);

    const entidade = repository.update.mock.calls[0][0];
    expect(entidade.price).toBe(entradaValida.price);
  });

  it("deve lançar erro ao atualizar com preço negativo", async () => {
    const entrada = { ...entradaValida, price: -100 };

    await expect(usecase.execute(entrada)).rejects.toThrow();
    expect(repository.update).not.toHaveBeenCalled();
  });

});
