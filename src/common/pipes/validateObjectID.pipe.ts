import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectID } from 'mongodb';

@Injectable()
export class ValidateObjectIDPipe implements PipeTransform<any, ObjectID> {
  transform(value: any): ObjectID {
    const validateObjectID: boolean = ObjectID.isValid(value);
    if (!validateObjectID) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  }
}
