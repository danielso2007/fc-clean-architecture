import Notification from "../notification/notification";
import NotificationError from "../notification/notification.error";
export default abstract class Entity {
  protected _id: string;
  public notification: Notification;

  constructor(id: string) {
    this.notification = new Notification();
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  hasErrors(): void {
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }
}
