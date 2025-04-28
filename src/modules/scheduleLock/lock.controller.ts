import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LockService } from './lock.service';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { UnlockSingleDeviceDto, GetAutoLockReportDto } from 'src/dto/lock.dto';

@ApiTags('Lock')
@Controller('lock')
export class LockController {
  constructor(private readonly lockService: LockService) {}

  @Post('bulk-auto-lock')
  @ApiOperation({ summary: 'Bulk Auto Lock Devices' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async bulkAutoLock(
    @UploadedFile() file: Express.Multer.File,
    @Body('transactionId') transactionId: string,
  ) {
    return this.lockService.bulkAutoLock(file.path, transactionId);
  }

  @Post('bulk-unlock')
  @ApiOperation({ summary: 'Bulk Unlock Devices' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async bulkUnlock(
    @UploadedFile() file: Express.Multer.File,
    @Body('transactionId') transactionId: string,
  ) {
    return this.lockService.bulkUnlock(file.path, transactionId);
  }

  @Post('unlock-single')
  @ApiOperation({ summary: 'Unlock Single Device' })
  async unlockSingle(@Body() unlockDto: UnlockSingleDeviceDto) {
    return this.lockService.unlockSingleDevice(unlockDto);
  }

  @Post('report')
  @ApiOperation({ summary: 'Get Auto Lock Report' })
  async getAutoLockReport(@Body() reportDto: GetAutoLockReportDto) {
    return this.lockService.getAutoLockReport(reportDto);
  }
}
