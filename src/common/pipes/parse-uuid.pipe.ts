import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseUUIDPipe implements PipeTransform {
  transform(value: string) {
    const regex = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    if (!regex.test(value))
      throw new BadRequestException('Invalid UUID format');

    return value;
  }
}
