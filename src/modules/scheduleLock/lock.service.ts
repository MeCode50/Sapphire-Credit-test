import { DatacultrService } from '../../lib/dataculture/dc.service';
import { CloudinaryService } from '../../lib/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { BulkAutoLockDto } from 'src/dto/lock.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as FormData from 'form-data';
import { isTokenExpired } from '../../utils/token.utils';

@Injectable()
export class LockService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly datacultrService: DatacultrService,
    private readonly configService: ConfigService,
  ) {}

  async bulkAutoLock(
    bulkAutoLockDto: BulkAutoLockDto,
    accessToken: string,
  ): Promise<any> {
    try {
      if (!accessToken || isTokenExpired(accessToken)) {
        throw new HttpException(
          'Access token is expired or invalid.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const formData = new FormData();
      formData.append('file', bulkAutoLockDto.file.buffer, {
        filename: bulkAutoLockDto.file.originalname,
        contentType: 'text/csv',
      });
      formData.append('TransactionId', bulkAutoLockDto.transactionId);

      const baseUrl = this.configService.get<string>('DATACULTR_BASE_URL');
      const client = this.configService.get<string>('DATACULTR_CLIENT');
      const lockUrl = `${baseUrl}v3/dem_${client}/auto_lock_activate/`;

      const response = await this.datacultrService.putFormData(
        lockUrl,
        formData,
        accessToken,
      );

      if (!response?.data) {
        throw new HttpException(
          'No response received from Datacultr API',
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        'Bulk Auto Lock Error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message || error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
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
