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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  first_name?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  last_name?: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  refresh_token?: string;

  @IsNumber()
  @IsOptional()
  code?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @IsString()
  @IsOptional()
  provider_type?: 'google' | 'local';

  @IsString()
  @IsOptional()
  provider_id?: string;

  @IsNumber()
  @IsOptional()
  language?: number;
}
