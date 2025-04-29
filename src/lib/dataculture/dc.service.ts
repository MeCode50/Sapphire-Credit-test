import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class DatacultrService {
  constructor(private readonly configService: ConfigService) {}

  async getAccessToken(): Promise<string> {
    const baseUrl = this.configService.get<string>('DATACULTR_BASE_URL');
    const username = this.configService.get<string>('DATACULTR_USERNAME');
    const password = this.configService.get<string>('DATACULTR_PASSWORD');

    const authUrl = `${baseUrl}token/`;

    try {
      const response = await axios.post(authUrl, {
        username,
        password,
      });

      const token = response.data?.access;
      if (!token) {
        throw new Error('Failed to retrieve the token.');
      }

      console.log('Access Token:', token);
      return token;
    } catch (error) {
      console.error('Auth Error:', error.response?.data || error.message);
      throw new Error('Authentication failed');
    }
  }

  async postJson(url: string, body: any, token: string) {
    return axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async putFormData(url: string, formData: FormData, token: string) {
    return axios.put(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    });
  }

  async getFileStream(url: string) {
    return axios.get(url, { responseType: 'stream' });
  }
}
