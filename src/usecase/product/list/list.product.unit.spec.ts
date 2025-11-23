import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

type RepositoryMock = {
  create: jest.Mock;
  findAll: jest.Mock;
  find: jest.Mock;
  update: jest.Mock;
};

const produto1 = ProductFactory.create("a", "PC Gamer", 5241.98);
const produto2 = ProductFactory.create("a", "Notebook", 2637.98);

const MockRepository = (): RepositoryMock => ({
  create: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn().mockResolvedValue([produto1, produto2]),
});

describe("Caso de uso: Listar produtos", () => {
  let repository: RepositoryMock;
  let usecase: ListProductUseCase;

  beforeEach(() => {
    repository = MockRepository();
    usecase = new ListProductUseCase(repository);
  });

  it("deve retornar a lista de produtos", async () => {
    const resultado = await usecase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(resultado).toHaveProperty("products");
    expect(resultado.products).toHaveLength(2);

    expect(resultado.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: produto1.id,
          name: produto1.name,
          price: produto1.price,
        }),
        expect.objectContaining({
          id: produto2.id,
          name: produto2.name,
          price: produto2.price,
        }),
      ])
    );
  });

  it("deve retornar lista vazia quando não houver produtos", async () => {
    repository.findAll.mockResolvedValueOnce([]);

    const resultado = await usecase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(resultado.products).toHaveLength(0);
    expect(resultado.products).toEqual([]);
  });

  it("deve manter o contrato de saída (campos obrigatórios)", async () => {
    const resultado = await usecase.execute();

    for (const p of resultado.products) {
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("name");
      expect(p).toHaveProperty("price");
      expect(typeof p.id).toBe("string");
      expect(typeof p.name).toBe("string");
      expect(typeof p.price).toBe("number");
    }
  });
});
