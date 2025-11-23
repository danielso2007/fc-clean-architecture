import Entity from "../../@shared/entity/entity.abstract";
import ProductInterface from "./product.interface";
import ProductValidatorFactory from "../factory/product.validator.factory";

export default class Product extends Entity implements ProductInterface {
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    super(id);
    this._name = name;
    this._price = price;
    this.validate();
    this.hasErrors();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  validate(): void {
    ProductValidatorFactory.create().validate(this);
  }

  changeName(name: string): void {
    this._name = name;
    this.validate();
  }

  changePrice(price: number): void {
    this._price = price;
    this.validate();
  }
  
}
