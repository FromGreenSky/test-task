import { IsArray, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddHolidaysDto {
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsNumber()
  year: number;

  @IsArray()
  @IsNotEmpty()
  holidays: string[];
}
