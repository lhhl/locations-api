import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  locationNumber: string;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsOptional()
  parentId?: string;
}
