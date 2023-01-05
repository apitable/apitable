/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { NodeRepository } from 'node/repositories/node.repository';

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
