import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const UUID_PATTERN =
  '^[a-fA-F0-9]{8}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{4}-?[a-fA-F0-9]{12}$';

const verifyUUID = (uuid: string) => {
  if (uuid === null) return false;
  return uuid.match(UUID_PATTERN);
};

export function IsArrayOfUuid(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsNotUuidOfArrayConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isNotUuid' })
export class IsNotUuidOfArrayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string[]) {
    for (const i of value) {
      if (typeof i !== 'string') return false;
      if (!verifyUUID(i)) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} must array of uuid`;
  }
}
