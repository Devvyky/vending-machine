import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMultipleOf', async: false })
export class IsMultipleOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [multiple] = args.constraints;
    return typeof value === 'number' && value % multiple === 0;
  }

  defaultMessage(args: ValidationArguments) {
    const [multiple] = args.constraints;
    return `${args.property} must be in multiples of ${multiple}`;
  }
}

export function IsMultipleOf(
  multiple: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [multiple],
      validator: IsMultipleOfConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isValidNumeric', async: false })
export class IsValidNumericConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [precision, scale] = args.constraints;

    if (isNaN(value)) {
      return false;
    }

    const stringValue = value.toString();
    const [integerPart, decimalPart] = stringValue.split('.');

    if (
      integerPart.length > precision - scale ||
      (decimalPart && decimalPart.length > scale)
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [precision, scale] = args.constraints;
    return `The numeric value must have a maximum of ${
      precision - scale
    } digits to the left and ${scale} digits to the right of the decimal point.`;
  }
}

export function IsValidNumeric(precision: number, scale: number) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'The numeric value is not valid.',
      },
      constraints: [precision, scale],
      validator: IsValidNumericConstraint,
    });
  };
}
