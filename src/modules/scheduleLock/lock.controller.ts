import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DatacultrService } from '../../lib/dataculture/dc.service';
import { LockService } from './lock.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  UnlockSingleDeviceDto,
  GetAutoLockReportDto,
  BulkAutoLockDto,
} from 'src/dto/lock.dto';
@ApiTags('Schedule Lock') // Updated tag to be more descriptive
@Controller('schedule-lock') // Updated controller path to match module name
export class LockController {
  constructor(
    private readonly lockService: LockService,
    private readonly datacultrService: DatacultrService,
  ) {}

  @Post('bulk-auto-lock')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Bulk Auto Lock Devices' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BulkAutoLockDto })
  async bulkAutoLock(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: BulkAutoLockDto,
  ) {
    return this.lockService.bulkAutoLock({
      file,
      transactionId: body.transactionId,
    });
  }

  @Get('get-token')
  async getToken() {
    const token = await this.datacultrService.getAccessToken();
    return { accessToken: token }; // Return the token in response
  }

  // @Post('bulk-unlock')
  // @ApiOperation({ summary: 'Bulk Unlock Devices' })
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // async bulkUnlock(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body('transactionId') transactionId: string,
  // ) {
  //   return this.lockService.bulkUnlock(file.path, transactionId);
  // }

  // @Post('unlock-single')
  // @ApiOperation({ summary: 'Unlock Single Device' })
  // async unlockSingle(@Body() unlockDto: UnlockSingleDeviceDto) {
  //   return this.lockService.unlockSingleDevice(unlockDto);
  // }

  // @Post('report')
  // @ApiOperation({ summary: 'Get Auto Lock Report' })
  // async getAutoLockReport(@Body() reportDto: GetAutoLockReportDto) {
  //   return this.lockService.getAutoLockReport(reportDto);
  // }
}
