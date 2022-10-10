import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsNotExists(
  validateService: (value: string) => Promise<boolean | undefined>,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsNotExistsConstraint,
      constraints: [validateService],
    });
  };
}

@ValidatorConstraint({ name: 'isNotExists' })
export class IsNotExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments?: ValidationArguments) {
    try {
      const validateService = validationArguments?.constraints?.[0];
      const isPass = await validateService(value, true);

      return isPass;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} is exists`;
  }
}
