import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsISO8601,
  IsNotEmpty,
} from 'class-validator';
export class CreateHackathonDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  FormatType: string;

  @IsOptional()
  @IsString()
  prizeCurrency?: string;

  @IsOptional()
  @IsNumber()
  prizeAmount?: number;

  @IsISO8601({ strict: true, strictSeparator: true })
  @Transform(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  topics: string[];
}
