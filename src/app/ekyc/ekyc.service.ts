import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InternalAxiosRequestConfig } from 'axios';
import { Observable, catchError, map } from 'rxjs';
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

  addFile(data: FileInput): Observable<FileResponse> {
    try {
      const formData = new FormData();
      const blob = new Blob([data.file.buffer], { type: data.file.mimetype });
      formData.append('file', blob, data.file.originalname);
      formData.append('title', data.title);
      formData.append('description', data.description);
      return this.httpService.post('/file-service/v1/addFile', formData).pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          throw error;
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
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
