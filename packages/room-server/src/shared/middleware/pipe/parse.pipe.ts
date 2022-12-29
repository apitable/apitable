import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isString } from 'class-validator';

@Injectable()
export class ParseObjectPipe implements PipeTransform<string, Object> {
  transform(value: string, metadata: ArgumentMetadata): number {
    if (!isString(value)) {
      return value;
    }
    try {
      return plainToClass(metadata.metatype, JSON.parse(value));
    } catch (e) {
      throw new BadRequestException('Bad Request');
    }
  }
}
