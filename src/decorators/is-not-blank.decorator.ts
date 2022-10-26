import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

export function IsNotBlank(validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: IsNotBlankConstraint,
		});
	};
}

@ValidatorConstraint({ name: 'isNotBlank' })
export class IsNotBlankConstraint implements ValidatorConstraintInterface {
	validate(value: string) {
		return typeof value === 'string' && value.trim().length > 0;
	}

	defaultMessage(validationArguments: ValidationArguments): string {
		return `${validationArguments.property} can not blank`;
	}
}
