import { DatacultrService } from '../../lib/dataculture/dc.service';
import { CloudinaryService } from '../../lib/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { BulkAutoLockDto } from 'src/dto/lock.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LockService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly datacultrService: DatacultrService,
    private readonly configService: ConfigService,
  ) {}

  async bulkAutoLock(bulkAutoLockDto: BulkAutoLockDto): Promise<any> {
    const accessToken = await this.datacultrService.getAccessToken();

    // Upload the file
    const uploadedFile = await this.cloudinaryService.uploadRawFile(
      bulkAutoLockDto.file.buffer,
      'bulk-auto-lock',
    );

    // Download the file back as a stream
    const fileResponse = await this.datacultrService.getFileStream(
      uploadedFile.secure_url,
    );

    // Create form-data
    const formData = require('form-data')();
    formData.append('file', fileResponse.data, {
      filename: bulkAutoLockDto.file.originalname,
      contentType: bulkAutoLockDto.file.mimetype,
    });
    formData.append('TransactionId', bulkAutoLockDto.transactionId);

    // API endpoint
    const lockUrl = `${this.configService.get<string>('DATACULTR_BASE_URL')}v3/lifecycle/dem_SENTINELOCK/auto_lock_activate/`;

    // Send PUT request
    const response = await this.datacultrService.putFormData(
      lockUrl,
      formData,
      accessToken,
    );
    return response.data;
  }

  // Same for other methods: unlockSingleDevice, bulkUnlock, getAutoLockReport
  // async bulkUnlock(filePath: string, transactionId: string): Promise<any> {
  //   const accessToken = await this.datacultrService.getAccessToken();
  //   const formData = new FormData();
  //   formData.append('file', fs.createReadStream(filePath));
  //   formData.append('TransactionId', transactionId);

  //   const unlockUrl = `${this.baseUrl}v3/lifecycle/dem_${this.client}/bulkapplyunlock/`;

  //   try {
  //     const response = await axios.put(unlockUrl, formData, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         ...formData.getHeaders(),
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(
  //       'Bulk Unlock Error:',
  //       error.response?.data || error.message,
  //     );
  //     throw new HttpException(
  //       'Failed to bulk unlock devices',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async unlockSingleDevice(unlockDto: UnlockSingleDeviceDto): Promise<any> {
  //   const accessToken = await this.getAccessToken();

  //   const unlockUrl = `${this.baseUrl}v3/lifecycle/dem_${this.client}/applyunlock/`;

  //   try {
  //     const response = await axios.post(
  //       unlockUrl,
  //       {
  //         imei1: unlockDto.imei1,
  //         TriggerID: unlockDto.triggerId,
  //         due_date: unlockDto.dueDate,
  //         due_time: unlockDto.dueTime,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error(
  //       'Unlock Single Device Error:',
  //       error.response?.data || error.message,
  //     );
  //     throw new HttpException(
  //       'Failed to unlock single device',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async getAutoLockReport(reportDto: GetAutoLockReportDto): Promise<any> {
  //   const accessToken = await this.getAccessToken();

  //   const reportUrl = `${this.reportBaseUrl}search/v4/autolock/`;

  //   try {
  //     const response = await axios.post(
  //       reportUrl,
  //       { actor: reportDto.actor, imei: reportDto.imei },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error(
  //       'Auto Lock Report Error:',
  //       error.response?.data || error.message,
  //     );
  //     throw new HttpException(
  //       'Failed to fetch auto lock report',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
