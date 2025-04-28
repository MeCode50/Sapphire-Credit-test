import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

@Injectable()
export class CloudinaryService {
  private readonly project: string;

  constructor(private configService: ConfigService) {
    this.project =
      this.configService.get<string>('PLATFORM_NAME') || 'default_project';

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Buffer,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `${this.project}/${folder}`,
            allowed_formats: ['jpg', 'png', 'pdf'],
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message)); // Ensure rejection with an Error object
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          },
        )
        .end(file);
    });
  }

  async uploadVideo(
    file: Buffer,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `${this.project}/${folder}`,
            resource_type: 'video', // Specify resource type as video
            allowed_formats: ['mp4', 'avi', 'mov'],
            transformation: [
              { quality: 'auto:good' }, // Maintain good video quality
              { width: 1920, height: 1080, crop: 'limit' }, // Limit resolution to 1080p
            ],
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message)); // Ensure rejection with an Error object
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          },
        )
        .end(file);
    });
  }

  async deleteMedia(
    publicId: string,
    resourceType: 'image' | 'video' = 'image',
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: resourceType },
        (error) => {
          if (error) {
            reject(new Error(error.message)); // Ensure rejection with an Error object
          } else {
            resolve();
          }
        },
      );
    });
  }

  extractPublicIdFromUrl(url: string): string {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
    const match = url.match(regex);
    if (match) {
      return match[1];
    }
    throw new Error('Invalid Cloudinary URL');
  }

  async uploadRawFile(
    file: Buffer,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `${this.project}/${folder}`,
            resource_type: 'raw', // Important: raw type for non-media files
            allowed_formats: ['csv', 'txt', 'pdf', 'docx'], // allow CSV and others if you want
          },
          (error, result) => {
            if (error) {
              reject(new Error(error.message));
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          },
        )
        .end(file);
    });
  }
}
