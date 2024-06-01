import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Axios, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';
import {
  FrontImageExtractRequest,
  FrontImageReponse,
} from './types/front-image.type';
import {
  BackImageExtractRequest,
  BackImageReponse,
} from './types/back-image.type';
import {
  FaceCompareRequest,
  FaceCompareResponse,
} from './types/face-compare.type';
import { FileInput, FileResponse } from './types/file.type';

export interface EkycServiceConfig {
  ekycBaseUrl: string;
  ekycAccessToken: string;
  ekycTokenId: string;
  ekycTokenKey: string;
}

@Injectable()
export class EkycService {
  private readonly log = new Logger(EkycService.name);
  constructor(
    private readonly httpService: HttpService,
    config: EkycServiceConfig,
  ) {
    const { ekycBaseUrl, ekycAccessToken, ekycTokenId, ekycTokenKey } = config;
    this.httpService.axiosRef.defaults.baseURL = ekycBaseUrl;
    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      `Bearer ${ekycAccessToken}`;

    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['Token-id'] = ekycTokenId;
        config.headers['Token-Key'] = ekycTokenKey;
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  async addFile(data: FileInput): Promise<FileResponse> {
    // try {
    //   const formData = new FormData();
    //   const blob = new Blob([data.file.buffer], { type: data.file.mimetype });
    //   formData.append('file', blob, data.file.originalname);
    //   formData.append('title', data.title);
    //   formData.append('description', data.description);
    //   const endPoint = '/file-service/v1/addFile';
    //   const response = await firstValueFrom<AxiosResponse<FileResponse>>(
    //     this.httpService.post(endPoint, formData).pipe(
    //       map((response) => response),
    //       catchError((error) => {
    //         this.log.error(error);
    //         throw error;
    //       }),
    //     ),
    //   );
    //   return response.data;
    // } catch (error) {
    //   console.error(error);
    //   throw error;
    // }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      message: 'IDG-00000000',
      object: {
        fileName: '38_jpg.rf.4e77a1a08efaef1b3a186a6432e0c2eb',
        tokenId: '181ba9f1-3d84-2964-e063-63199f0a447e',
        description: 'Mô tả CCCD',
        storageType: 'IDG01',
        title: 'Mẫu CCCD',
        uploadedDate: '5/30/24 9:50 PM',
        hash: 'idg20240530-19adfd1b-2a16-1c17-e063-63199f0a7bf7/IDG01_f6c647a7-1e93-11ef-8596-c1f4eb50d86e',
        fileType: 'jpg',
      },
    };
  }

  extractFrontImage(
    data: FrontImageExtractRequest,
  ): Observable<FrontImageReponse> {
    return this.httpService.post('/ai/v1/ocr/id/front', data).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(error);
        throw error;
      }),
    );
  }

  extractBackImage(
    data: BackImageExtractRequest,
  ): Observable<BackImageReponse> {
    return this.httpService.post('/ai/v1/ocr/id/back', data).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(error);
        throw error;
      }),
    );
  }

  faceCompareToDocument(
    data: FaceCompareRequest,
  ): Observable<FaceCompareResponse> {
    return this.httpService.post('/ai/v1/face/compare', data).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(error);
        throw error;
      }),
    );
  }
}
