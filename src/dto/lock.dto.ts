import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnlockSingleDeviceDto {
  @ApiProperty({
    example: '123456789012345',
    description: 'IMEI number of the device',
  })
  @IsString()
  @IsNotEmpty()
  imei1: string;

  @ApiProperty({
    example: 'TRIGGER_12345',
    description: 'Trigger ID for unlock',
  })
  @IsString()
  @IsNotEmpty()
  triggerId: string;

  @ApiProperty({ example: '2025-05-01', description: 'Due date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ example: '18:30:00', description: 'Due time (HH:MM:SS)' })
  @IsString()
  @IsNotEmpty()
  dueTime: string;
}

export class GetAutoLockReportDto {
  @ApiProperty({ example: 'Admin', description: 'Actor requesting the report' })
  @IsString()
  actor: string;

  @ApiProperty({
    example: '123456789012345',
    description: 'IMEI number (optional)',
  })
  @IsString()
  @IsOptional()
  imei?: string;
}

export class BulkAutoLockDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV file containing device IMEIs to lock',
  })
  file: Express.Multer.File;

  @ApiProperty({
    example: '123456789012345',
    description: 'Transaction ID of the device',
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
