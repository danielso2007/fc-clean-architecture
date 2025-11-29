import Product from "../../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../../domain/product/repository/product-repository.interface";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductRepositoryInterface {
  async create(entity: Product): Promise<void> {
    await ProductModel.create({
      id: entity.id,
      name: entity.name,
      price: entity.price,
    });
  }

  async update(entity: Product): Promise<void> {
    const productModel = await ProductModel.findByPk(entity.id);
    if (!productModel) {
      throw new Error("Product not found");
    }
    productModel.name = entity.name;
    productModel.price = entity.price;
    await productModel.save();
  }

  async find(id: string): Promise<Product> {
    const productModel = await ProductModel.findByPk(id);
    if (!productModel) throw new Error("Product not found");
    return new Product(productModel.id, productModel.name, productModel.price);
  }

  async findAll(): Promise<Product[]> {
    const productModels = await ProductModel.findAll();
    return productModels.map((productModel) =>
      new Product(productModel.id, productModel.name, productModel.price)
    );
  }
}
