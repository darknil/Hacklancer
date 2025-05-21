import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
export class CreateUserDto {
  @IsNumber()
  chatId: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;
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
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

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
