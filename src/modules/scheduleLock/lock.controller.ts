import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DatacultrService } from '../../lib/dataculture/dc.service';
import { LockService } from './lock.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Headers } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  UnlockSingleDeviceDto,
  GetAutoLockReportDto,
  BulkAutoLockDto,
} from 'src/dto/lock.dto';

@ApiBearerAuth('Authorization')
@ApiTags('Schedule Lock')
@Controller('schedule-lock')
export class LockController {
  constructor(
    private readonly lockService: LockService,
    private readonly datacultrService: DatacultrService,
  ) {}

  @Put('auto_lock_activate')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Bulk Auto Lock Devices' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        TransactionId: { type: 'string' },
      },
      required: ['file', 'TransactionId'],
    },
  })
  async bulkAutoLock(
    @UploadedFile() file: Express.Multer.File,
    @Body('TransactionId') transactionId: string,
  ) {
    if (!file) throw new Error('File is missing');
    if (!transactionId) throw new Error('TransactionId is missing');

    // Get a fresh access token
    const accessToken = await this.datacultrService.getAccessToken();

    const bulkAutoLockDto: BulkAutoLockDto = {
      file,
      transactionId,
    };

    return this.lockService.bulkAutoLock(bulkAutoLockDto, accessToken);
  }

  @Get('get-token')
  async getToken() {
    const token = await this.datacultrService.getAccessToken();
    return { accessToken: token };
  }
}
