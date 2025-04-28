// src/modules/datacultr/datacultr.config.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DatacultrConfigService {
  private token: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async getAccessToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    const username = this.configService.get<string>('DATACULTR_USERNAME');
    const password = this.configService.get<string>('DATACULTR_PASSWORD');
    const baseUrl = this.configService.get<string>('DATACULTR_BASE_URL');

    try {
      const response = await axios.post(
        `${baseUrl}token/`,
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      this.token = response.data.access; // Important: getting the "access" token
      return this.token;
    } catch (error) {
      console.error('Error fetching Datacultr token', error);
      throw new Error('Unable to fetch Datacultr token');
    }
  }

  getBaseUrl(): string {
    return this.configService.get<string>('DATACULTR_BASE_URL');
  }

  getClientId(): string {
    return this.configService.get<string>('DATACULTR_CLIENT_ID');
  }
}
