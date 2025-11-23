import Product from "domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";

export default class UpdateProductUseCase {
  private ProductRepository: ProductRepositoryInterface;
  constructor(ProductRepository: ProductRepositoryInterface) {
    this.ProductRepository = ProductRepository;
  }

  async execute(
    input: InputUpdateProductDto
  ): Promise<OutputUpdateProductDto> {
    const productInterface = await this.ProductRepository.find(input.id);
    if (!productInterface) throw new Error("Product not found");

    const product = productInterface as unknown as Product;
    product.changeName(input.name);
    product.changePrice(input.price);
    product.hasErrors();

    await this.ProductRepository.update(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price
    };
  }
}
