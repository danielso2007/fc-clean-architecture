import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../entity/product";
import * as yup from "yup";

export default class ProductYupValidator
  implements ValidatorInterface<Product> {
  validate(entity: Product): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().trim()
            .min(1, "Id is required").required("Id is required"),
          name: yup.string().trim()
            .min(1, "Name is required").required("Name is required"),
          price: yup
            .number()
            .typeError("Price must be a valid number")
            .required("Price is required")
            .test(
              "is-number",
              "Price must be a valid number",
              (value) => value !== undefined && !isNaN(value)
            )
            .moreThan(0, "Price must be greater than zero")
        })
        .validateSync(
          {
            id: entity.id,
            name: entity.name,
            price: entity.price
          },
          {
            abortEarly: false,
          }
        );
    } catch (errors) {
      console.log(errors)
      const e = errors as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: "product",
          message: error,
        });
      });
    }
  }
}
