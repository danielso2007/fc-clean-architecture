import Entity from "../../@shared/entity/entity.abstract";
import Address from "../value-object/address";
import NotificationError from "../../@shared/notification/notification.error";
import CustomerValidatorFactory from "../factory/customer.validator.factory";

export default class Customer extends Entity {
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    super(id);
    this._name = name;
    this.validate();
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate(): void {
    CustomerValidatorFactory.create().validate(this);
  }

  changeName(name: string): void {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address): void {
    this._address = address;
  }

  isActive(): boolean {
    return this._active;
  }

  activate(): void {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate(): void {
    this._active = false;
  }

  addRewardPoints(points: number): void {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
