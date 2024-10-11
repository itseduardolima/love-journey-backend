import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

export function IsDateString(format: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return moment(value, format, true).isValid();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date string in the format ${format}`;
        },
      },
    });
  };
}