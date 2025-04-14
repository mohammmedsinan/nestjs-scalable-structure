import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
