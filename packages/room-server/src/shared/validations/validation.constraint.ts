import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { NodeRepository } from 'database/repositories/node.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsNodeExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly nodeService: NodeRepository) {}
  async validate(nodeId: string, args: ValidationArguments) {
    const result = await this.nodeService.selectSpaceIdByNodeId(nodeId);
    if (!result) {
      return false;
    }
    return args.object['spaceId'] === undefined || result.spaceId === args.object['spaceId'];
  }
}

export function IsNodeExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNodeExistConstraint,
    });
  };
}
