import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator';
export class CreateUserDto {
  @IsNumber()
  chatId: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  language_code?: string;
}
export class getUserDto {
  @IsNumber()
  chatId: number;
}
export class GetUsersByIdsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  Ids: number[];
}
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  language_code?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsString()
  photoURL?: string;
}

export class ResponseUserDto {
  chatId: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  state?: string;
  language_code?: string;
  nickname?: string;
  city?: string;
  description?: string;
  photoURL?: string;
  roleId?: string;

  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}
