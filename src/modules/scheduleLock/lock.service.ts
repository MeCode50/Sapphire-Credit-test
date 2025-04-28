import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { UnlockSingleDeviceDto, GetAutoLockReportDto } from 'src/dto/lock.dto';

@Injectable()
export class LockService {
  private readonly baseUrl: string;
  private readonly reportBaseUrl: string;
  private readonly username: string;
  private readonly password: string;
  private readonly client: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('DATACULTR_BASE_URL', '');
    this.reportBaseUrl = this.configService.get<string>(
      'DATACULTR_REPORT_BASE_URL',
      '',
    );
    this.username = this.configService.get<string>('DATACULTR_USERNAME', '');
    this.password = this.configService.get<string>('DATACULTR_PASSWORD', '');
    this.client = this.configService.get<string>(
      'DATACULTR_CLIENT',
      'SENTINELOCK',
    ); // Default to SENTINELOCK
  }

  private async getAccessToken(): Promise<string> {
    try {
      const authUrl = `${this.baseUrl}token/`;
      const response = await axios.post(authUrl, {
        username: this.username,
        password: this.password,
      });

      const token = response.data?.refresh;
      if (!token) throw new Error('Invalid token response');
      return token;
    } catch (error) {
      throw new HttpException('Authentication Failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async bulkAutoLock(filePath: string, transactionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('TransactionId', transactionId);

    const lockUrl = `${this.baseUrl}v3/lifecycle/dem_${this.client}/auto_lock_activate/`;

    try {
      const response = await axios.put(lockUrl, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...formData.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to bulk auto lock devices',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async bulkUnlock(filePath: string, transactionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('TransactionId', transactionId);

    const unlockUrl = `${this.baseUrl}v3/lifecycle/dem_${this.client}/bulkapplyunlock/`;

    try {
      const response = await axios.put(unlockUrl, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...formData.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to bulk unlock devices',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async unlockSingleDevice(unlockDto: UnlockSingleDeviceDto): Promise<any> {
    const accessToken = await this.getAccessToken();

    const unlockUrl = `${this.baseUrl}v3/lifecycle/dem_${this.client}/applyunlock/`;

    try {
      const response = await axios.post(
        unlockUrl,
        {
          imei1: unlockDto.imei1,
          TriggerID: unlockDto.triggerId,
          due_date: unlockDto.dueDate,
          due_time: unlockDto.dueTime,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to unlock single device',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAutoLockReport(reportDto: GetAutoLockReportDto): Promise<any> {
    const accessToken = await this.getAccessToken();

    const reportUrl = `${this.reportBaseUrl}search/v4/autolock/`;

    try {
      const response = await axios.post(
        reportUrl,
        { actor: reportDto.actor, imei: reportDto.imei },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch auto lock report',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
