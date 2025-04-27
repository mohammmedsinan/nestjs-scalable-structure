import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import Users from '../users.entity';

export class CreateUserDto extends Users {

}
