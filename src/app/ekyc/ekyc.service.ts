import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
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

export abstract class EkycService {
  abstract addFile(data: FileInput): Promise<FileResponse>;
  abstract extractFrontImage(
    data: FrontImageExtractRequest,
  ): Promise<FrontImageReponse>;
  abstract extractBackImage(
    data: BackImageExtractRequest,
  ): Promise<BackImageReponse>;
  abstract faceCompareToDocument(
    data: FaceCompareRequest,
  ): Promise<FaceCompareResponse>;
}

@Injectable()
export class EkycServiceImpl extends EkycService {
  private readonly log = new Logger(EkycService.name);
  private axiosConfig: Record<string, any>;
  constructor(
    private readonly httpService: HttpService,
    config: EkycServiceConfig,
  ) {
    super();
    const { ekycBaseUrl, ekycAccessToken, ekycTokenId, ekycTokenKey } = config;
    this.httpService.axiosRef.defaults.baseURL = ekycBaseUrl;
    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      `Bearer ${ekycAccessToken}`;

    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['Token-id'] = ekycTokenId;
        config.headers['Token-key'] = ekycTokenKey;
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  async addFile(data: FileInput): Promise<FileResponse> {
    try {
      const formData = new FormData();
      const blob = new Blob([data.file.buffer], { type: data.file.mimetype });
      formData.append('file', blob, data.file.originalname);
      formData.append('title', data.title);
      formData.append('description', data.description);
      const endPoint = '/file-service/v1/addFile';
      const response = await firstValueFrom<AxiosResponse<FileResponse>>(
        this.httpService.post(endPoint, formData).pipe(
          map((response) => response),
          catchError((error) => {
            this.log.error(error);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async extractFrontImage(
    data: FrontImageExtractRequest,
  ): Promise<FrontImageReponse> {
    console.log('data', data);
    return await firstValueFrom(
      this.httpService.post('/ai/v1/ocr/id/front', data).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          console.error(JSON.stringify(error));
          throw error;
        }),
      ),
    );
  }

  async extractBackImage(
    data: BackImageExtractRequest,
  ): Promise<BackImageReponse> {
    return await firstValueFrom(
      this.httpService.post('/ai/v1/ocr/id/back', data).pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error(error);
          throw new BadRequestException(error);
        }),
      ),
    );
  }

  faceCompareToDocument(
    data: FaceCompareRequest,
  ): Promise<FaceCompareResponse> {
    return firstValueFrom(
      this.httpService.post('/ai/v1/face/compare', data).pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new BadRequestException(error);
        }),
      ),
    );
  }
}

@Injectable()
export class MockEkycService extends EkycService {
  addFile(data: FileInput): Promise<FileResponse> {
    return Promise.resolve({
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
    });
  }
  extractFrontImage(
    data: FrontImageExtractRequest,
  ): Promise<FrontImageReponse> {
    return Promise.resolve({
      imgs: {
        img_front:
          'idg20240530-19adfd1b-2a16-1c17-e063-63199f0a7bf7/IDG01_f6c647a7-1e93-11ef-8596-c1f4eb50d86e',
      },
      dataSign:
        'lC8gfRzljcR3iY7/0NQGJjolKVHejJ+4pZp3AuH1M6vp7jEo3v72Xh2K5/Sl3wbrGPR1+HOzcidREsxdWmAZTw==',
      dataBase64:
        'eyJpbWdzIjp7ImltZ19mcm9udCI6ImlkZzIwMjQwNTMwLTE5YWRmZDFiLTJhMTYtMWMxNy1lMDYzLTYzMTk5ZjBhN2JmNy9JREcwMV9mNmM2NDdhNy0xZTkzLTExZWYtODU5Ni1jMWY0ZWI1MGQ4NmUifSwibWVzc2FnZSI6IklERy0wMDAwMDAwMCIsInNlcnZlcl92ZXJzaW9uIjoiMS41LjE1Iiwib2JqZWN0Ijp7Im9yaWdpbl9sb2NhdGlvbiI6IkjDsmEgVGjhu40gxJDDtG5nLCBD4bqpbSBM4buHLCDEkMOgIE7hurVuZyIsIm1zZyI6Ik9LIiwibmFtZV9wcm9iIjowLjk5OTk5OTk5MDgzMDA1NDYsImdlbmRlciI6Ik5hbSIsIm5hbWVfZmFrZV93YXJuaW5nX3Byb2IiOjAuMTAyODMxMTI1MjU5Mzk5NDEsImNvdmVyX3Byb2JfZnJvbnQiOjAsImV4cGlyZV93YXJuaW5nIjoibm8iLCJhZGRyZXNzX2Zha2Vfd2FybmluZyI6ZmFsc2UsInZhbGlkX2RhdGVfcHJvYiI6MSwibmF0aW9uX3BvbGljeSI6IkPhu5hORyBIw5JBIFjDgyBI4buYSSBDSOG7piBOR0jEqEEgVknhu4ZUIE5BTSIsIm9yaWdpbl9sb2NhdGlvbl9wcm9iIjowLjk5OTk5ODkyNzI2ODY0MDksImNvcm5lcl93YXJuaW5nIjoibm8iLCJnZW5lcmFsX3dhcm5pbmciOltdLCJ2YWxpZF9kYXRlIjoiMTQvMDUvMjAyOCIsImR1cHBsaWNhdGlvbl93YXJuaW5nIjpmYWxzZSwiaXNzdWVfZGF0ZSI6Ii0iLCJpZF9mYWtlX3Byb2IiOjAsImNoZWNraW5nX3Jlc3VsdF9mcm9udCI6eyJjb3JuZXJfY3V0X3Jlc3VsdCI6IjAiLCJlZGl0ZWRfcHJvYiI6MC4wODIwMzE2OTcwMzQ4MzU4MiwicmVjYXB0dXJlZF9yZXN1bHQiOiIwIiwiY2hlY2tfcGhvdG9jb3BpZWRfcHJvYiI6MCwiY29ybmVyX2N1dF9wcm9iIjpbMC4wODM4NDI5MDMzNzU2MjU2MSwwLjA4Mzg0MjkwMzM3NTYyNTYxLDAuMDgzODQyOTAzMzc1NjI1NjEsMC4wODM4NDI5MDMzNzU2MjU2MV0sImNoZWNrX3Bob3RvY29waWVkX3Jlc3VsdCI6IjAiLCJlZGl0ZWRfcmVzdWx0IjoiMCIsInJlY2FwdHVyZWRfcHJvYiI6MC42ODk2MTM2NDAzMDgzODAxfSwiaWQiOiIwNDgyMDMwMDgwNDQiLCJpZF9wcm9icyI6IlswLjk5OTk0NzMsIDEuMCwgMS4wLCAxLjAsIDAuOTk5OTk3ODUsIDEuMCwgMS4wLCAwLjk5OTk5OTksIDEuMCwgMC45OTk5OTk5LCAxLjAsIDEuMF0iLCJjaXRpemVuX2lkX3Byb2IiOjAsImRvYl9mYWtlX3dhcm5pbmdfcHJvYiI6MC4wNTU1MTE4MzIyMzcyNDM2NSwiYmlydGhfZGF5X3Byb2IiOjAuOTk5OTkxODgxODQ3MzgxNiwiaXNzdWVfcGxhY2UiOiItIiwicmVjZW50X2xvY2F0aW9uIjoiVOG7lSAzNlxuSMOyYSBUaOG7jSDEkMO0bmcsIEPhuqltIEzhu4csIMSQw6AgTuG6tW5nIiwiaWRfZmFrZV93YXJuaW5nIjoibm8iLCJkb2JfZmFrZV93YXJuaW5nIjpmYWxzZSwibmFtZV9mYWtlX3dhcm5pbmciOiJyZWFsIiwibmFtZV9wcm9icyI6WzAuOTk5OTk5ODgwNzkwNzEwNCwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMV0sInR5cGVfaWQiOjUsImNhcmRfdHlwZSI6IkPEgk4gQ8av4buaQyBDw5RORyBEw4JOIiwicXVhbGl0eV9mcm9udCI6eyJibHVyX3Njb3JlIjowLjA3MjgsImJyaWdodF9zcG90X3BhcmFtIjp7ImF2ZXJhZ2VfaW50ZW5zaXR5IjoxNDYuMjcsImJyaWdodF9zcG90X3RocmVzaG9sZCI6MC41MiwidG90YWxfYnJpZ2h0X3Nwb3RfYXJlYSI6MH0sImx1bWluYW5jZV9zY29yZSI6MC41NzE0LCJmaW5hbF9yZXN1bHQiOnsiYmFkX2x1bWluYW5jZV9saWtlbGlob29kIjoidW5saWtlbHkiLCJsb3dfcmVzb2x1dGlvbl9saWtlbGlob29kIjoidW5saWtlbHkiLCJibHVycmVkX2xpa2VsaWhvb2QiOiJ1bmxpa2VseSIsImJyaWdodF9zcG90X2xpa2VsaWhvb2QiOiJ1bmxpa2VseSJ9LCJicmlnaHRfc3BvdF9zY29yZSI6MCwicmVzb2x1dGlvbiI6WzQ1MCw3MjBdfSwiYmlydGhfZGF5IjoiMTQvMDUvMjAwMyIsImlzc3VlX2RhdGVfcHJvYiI6MCwiY2l0aXplbl9pZCI6Ii0iLCJyZWNlbnRfbG9jYXRpb25fcHJvYiI6MC45OTk5OTU3ODg1NzQ2MTAyLCJpc3N1ZV9wbGFjZV9wcm9iIjowLCJuYXRpb25hbGl0eSI6IlZp4buHdCBOYW0iLCJwb3N0X2NvZGUiOlt7ImRlYnVnIjoidHJlZSIsImNpdHkiOlsiNDgiLCJUaMOgbmggcGjhu5EgxJDDoCBO4bq1bmciLDFdLCJkaXN0cmljdCI6WyI0OTUiLCJRdeG6rW4gQ+G6qW0gTOG7hyIsMV0sIndhcmQiOlsiMjAzMTIiLCJQaMaw4budbmcgSMOyYSBUaOG7jSDEkMO0bmciLDFdLCJkZXRhaWwiOiJU4buVIDM2IiwidHlwZSI6ImFkZHJlc3MifSx7ImRlYnVnIjoidHJlZSIsImNpdHkiOlsiNDgiLCJUaMOgbmggcGjhu5EgxJDDoCBO4bq1bmciLDFdLCJkaXN0cmljdCI6WyI0OTUiLCJRdeG6rW4gQ+G6qW0gTOG7hyIsMV0sIndhcmQiOlsiMjAzMTIiLCJQaMaw4budbmcgSMOyYSBUaOG7jSDEkMO0bmciLDFdLCJkZXRhaWwiOiIiLCJ0eXBlIjoiaG9tZXRvd24ifV0sIm5hbWUiOiJMw4ogTUlOSCBLSMOBTkgiLCJ0YW1wZXJpbmciOnsiaXNfbGVnYWwiOiJ5ZXMiLCJ3YXJuaW5nIjpbXX19LCJzdGF0dXNDb2RlIjoyMDAsImNoYWxsZW5nZUNvZGUiOiIxMTExMSJ9',
      logID: 'e0f5c1f8-1e94-11ef-854e-a5999702d15d-ae4be42f-Zuulserver',
      message: 'IDG-00000000',
      server_version: '1.5.15',
      object: {
        origin_location: 'Tam Quang, Núi Thành, Quảng Nam',
        msg: 'OK',
        name_prob: 0.9999999908300546,
        gender: 'Nam',
        name_fake_warning_prob: 0.10283112525939941,
        cover_prob_front: 0,
        expire_warning: 'no',
        address_fake_warning: false,
        valid_date_prob: 1,
        nation_policy: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        origin_location_prob: 0.9999989272686409,
        corner_warning: 'no',
        general_warning: [],
        valid_date: '27/12/2023',
        dupplication_warning: false,
        issue_date: '-',
        id_fake_prob: 0,
        checking_result_front: {
          corner_cut_result: '0',
          edited_prob: 0.08203169703483582,
          recaptured_result: '0',
          check_photocopied_prob: 0,
          corner_cut_prob: [
            0.08384290337562561, 0.08384290337562561, 0.08384290337562561,
            0.08384290337562561,
          ],
          check_photocopied_result: '0',
          edited_result: '0',
          recaptured_prob: 0.6896136403083801,
        },
        id: '048203008044',
        id_probs:
          '[0.9999473, 1.0, 1.0, 1.0, 0.99999785, 1.0, 1.0, 0.9999999, 1.0, 0.9999999, 1.0, 1.0]',
        citizen_id_prob: 0,
        dob_fake_warning_prob: 0.05551183223724365,
        birth_day_prob: 0.9999918818473816,
        issue_place: '-',
        recent_location: 'Sâm linh Tây, Tam Quang, Núi Thành, Quảng Nam',
        id_fake_warning: 'no',
        dob_fake_warning: false,
        name_fake_warning: 'real',
        name_probs: [0.9999998807907104, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        type_id: 5,
        card_type: 'CĂN CƯỚC CÔNG DÂN',
        quality_front: {
          blur_score: 0.0728,
          bright_spot_param: {
            average_intensity: 146.27,
            bright_spot_threshold: 0.52,
            total_bright_spot_area: 0,
          },
          luminance_score: 0.5714,
          final_result: {
            bad_luminance_likelihood: 'unlikely',
            low_resolution_likelihood: 'unlikely',
            blurred_likelihood: 'unlikely',
            bright_spot_likelihood: 'unlikely',
          },
          bright_spot_score: 0,
          resolution: [450, 720],
        },
        birth_day: '04/06/2003',
        issue_date_prob: 0,
        citizen_id: '-',
        recent_location_prob: 0.9999957885746102,
        issue_place_prob: 0,
        nationality: 'Việt Nam',
        post_code: [
          {
            debug: 'tree',
            city: ['48', 'Tỉnh Quảng Nam', 1],
            district: ['495', 'Huyện Núi Thành', 1],
            ward: ['20312', 'Xã Tam Quang', 1],
            detail: 'Sâm linh Tây',
            type: 'address',
          },
          {
            debug: 'tree',
            city: ['48', 'Tỉnh Quảng Nam', 1],
            district: ['495', 'Huyện Núi Thành', 1],
            ward: ['20312', 'Xã Tam Quang', 1],
            detail: 'Sâm linh Tây',
            type: 'hometown',
          },
        ],
        name: 'PHAN VĂN MINH',
        tampering: {
          is_legal: 'yes',
          warning: [],
        },
      },
      statusCode: 200,
      challengeCode: '11111',
    });
  }
  extractBackImage(data: BackImageExtractRequest): Promise<BackImageReponse> {
    return Promise.resolve({
      imgs: {
        img_back:
          'idg20240530-19adfd1b-2a16-1c17-e063-63199f0a7bf7/IDG01_613c3ca5-1e96-11ef-a132-d5a7008f4b5f',
      },
      dataSign:
        'VA5J14iEXdZTa9QUxh56tmL0AM0suHNwoqWNxYthfrytIV0UxvM0uzC3SmeG22jZbV2XnmvsqaXxiBg89Muz0Q==',
      dataBase64:
        'eyJpbWdzIjp7ImltZ19iYWNrIjoiaWRnMjAyNDA1MzAtMTlhZGZkMWItMmExNi0xYzE3LWUwNjMtNjMxOTlmMGE3YmY3L0lERzAxXzYxM2MzY2E1LTFlOTYtMTFlZi1hMTMyLWQ1YTcwMDhmNGI1ZiJ9LCJtZXNzYWdlIjoiSURHLTAwMDAwMDAwIiwic2VydmVyX3ZlcnNpb24iOiIxLjUuMTUiLCJvYmplY3QiOnsiaXNzdWVfcGxhY2UiOiJD4bukQyBUUsav4bueTkcgQ+G7pEMgQ+G6ok5IIFPDgVRcblFV4bqiTiBMw50gSMOATkggQ0jDjU5IIFbhu4AgVFLhuqxUIFThu7AgWMODIEjhu5hJIiwiaXNzdWVfZGF0ZV9wcm9icyI6WzAuOTk5OTkyODQ3NDQyNjI3LDAuOTk5OTk5NzYxNTgxNDIwOSwxLDAuOTk5OTk5ODgwNzkwNzEwNCwwLjk5OTk4MTY0MTc2OTQwOTIsMSwxLDEsMC45OTk5OTkxNjU1MzQ5NzMxLDAuOTk5MDc0OTM1OTEzMDg1OV0sImJhY2tfdHlwZV9pZCI6NSwibXJ6X3Byb2JzIjpbMC45OTk5OTk5MDQ2MzI1Njg0LDAuOTk5OTk5MjI5MTEzMjYwOSwwLjk5OTk5ODIyMzc4MTU4NTZdLCJjaGVja2luZ19yZXN1bHRfYmFjayI6eyJjb3JuZXJfY3V0X3Jlc3VsdCI6IjAiLCJlZGl0ZWRfcHJvYiI6MCwicmVjYXB0dXJlZF9yZXN1bHQiOiIxIiwiY2hlY2tfcGhvdG9jb3BpZWRfcHJvYiI6MCwiY29ybmVyX2N1dF9wcm9iIjpbMC4xMjQyMzU5MjgwNTg2MjQyNywwLjEyNDIzNTkyODA1ODYyNDI3LDAuMTI0MjM1OTI4MDU4NjI0MjcsMC4xMjQyMzU5MjgwNTg2MjQyN10sImNoZWNrX3Bob3RvY29waWVkX3Jlc3VsdCI6IjAiLCJlZGl0ZWRfcmVzdWx0IjoiMCIsInJlY2FwdHVyZWRfcHJvYiI6MC45NjkzOTA3NDk5MzEzMzU0fSwiZ2VuZXJhbF93YXJuaW5nIjpbXSwiZmVhdHVyZXMiOiJO4buRdCBydeG7k2kgbmdheSDEkXXDtGkgbMO0bmcgbcOgeSB0csOhaSIsImlzc3VlX2RhdGVfcHJvYiI6MC45OTk5MDQ4MjMzMDMyMjI2LCJtcnpfdmFsaWRfc2NvcmUiOjEwMCwiaXNzdWVfcGxhY2VfcHJvYiI6MC45OTk5OTk5OSwiaXNzdWVfZGF0ZSI6IjEyLzA0LzIwMjEiLCJtcnoiOlsiSURWTk0yMDMwMDA5NjMxMDcwMjAzMDAwOTYzPDwyIiwiMDMwMTAxN00yODAxMDE2Vk5NPDw8PDw8PDw8PDwyIiwiTkdVWUVOPDxOSEFUPEhBTzw8PDw8PDw8PDw8PDw8Il0sInF1YWxpdHlfYmFjayI6eyJibHVyX3Njb3JlIjowLjE5MDIsImJyaWdodF9zcG90X3BhcmFtIjp7ImF2ZXJhZ2VfaW50ZW5zaXR5IjoxNzguNjksImJyaWdodF9zcG90X3RocmVzaG9sZCI6MC41MiwidG90YWxfYnJpZ2h0X3Nwb3RfYXJlYSI6MH0sImx1bWluYW5jZV9zY29yZSI6MC42OTgsImZpbmFsX3Jlc3VsdCI6eyJiYWRfbHVtaW5hbmNlX2xpa2VsaWhvb2QiOiJ1bmxpa2VseSIsImxvd19yZXNvbHV0aW9uX2xpa2VsaWhvb2QiOiJ1bmxpa2VseSIsImJsdXJyZWRfbGlrZWxpaG9vZCI6InVubGlrZWx5IiwiYnJpZ2h0X3Nwb3RfbGlrZWxpaG9vZCI6InVubGlrZWx5In0sImJyaWdodF9zcG90X3Njb3JlIjowLCJyZXNvbHV0aW9uIjpbNDUwLDcyMF19LCJpc3N1ZWRhdGVfZmFrZV93YXJuaW5nIjpmYWxzZSwiYmFja19jb3JuZXJfd2FybmluZyI6Im5vIiwibXJ6X3Byb2IiOjAuOTk5OTk5MTE5MTc1ODA1LCJiYWNrX2V4cGlyZV93YXJuaW5nIjoibm8iLCJtc2dfYmFjayI6Ik9LIiwiZmVhdHVyZXNfcHJvYiI6MC45OTk5OTUwNzYyMDEwMjgzfSwic3RhdHVzQ29kZSI6MjAwLCJjaGFsbGVuZ2VDb2RlIjoiMTExMTEifQ==',
      logID: '98365581-1e96-11ef-9704-3fab2a276ffe-32a52efd-Zuulserver',
      message: 'IDG-00000000',
      server_version: '1.5.15',
      object: {
        issue_place:
          'CỤC TRƯỞNG CỤC CẢNH SÁT\nQUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI',
        issue_date_probs: [
          0.999992847442627, 0.9999997615814209, 1, 0.9999998807907104,
          0.9999816417694092, 1, 1, 1, 0.9999991655349731, 0.9990749359130859,
        ],
        back_type_id: 5,
        mrz_probs: [0.9999999046325684, 0.9999992291132609, 0.9999982237815856],
        checking_result_back: {
          corner_cut_result: '0',
          edited_prob: 0,
          recaptured_result: '1',
          check_photocopied_prob: 0,
          corner_cut_prob: [
            0.12423592805862427, 0.12423592805862427, 0.12423592805862427,
            0.12423592805862427,
          ],
          check_photocopied_result: '0',
          edited_result: '0',
          recaptured_prob: 0.9693907499313354,
        },
        general_warning: [],
        features: 'Sẹo chám C 0,5cn trên sau cánh mũi phải',
        issue_date_prob: 0.9999048233032226,
        mrz_valid_score: 100,
        issue_place_prob: 0.99999999,
        issue_date: '27/12/2021',
        mrz: [
          'IDVNM2030009631070203000963<<2',
          '0301017M2801016VNM<<<<<<<<<<<2',
          'NGUYEN<<NHAT<HAO<<<<<<<<<<<<<<',
        ],
        quality_back: {
          blur_score: 0.1902,
          bright_spot_param: {
            average_intensity: 178.69,
            bright_spot_threshold: 0.52,
            total_bright_spot_area: 0,
          },
          luminance_score: 0.698,
          final_result: {
            bad_luminance_likelihood: 'unlikely',
            low_resolution_likelihood: 'unlikely',
            blurred_likelihood: 'unlikely',
            bright_spot_likelihood: 'unlikely',
          },
          bright_spot_score: 0,
          resolution: [450, 720],
        },
        issuedate_fake_warning: false,
        back_corner_warning: 'no',
        mrz_prob: 0.999999119175805,
        back_expire_warning: 'no',
        msg_back: 'OK',
        features_prob: 0.9999950762010283,
      },
      statusCode: 200,
      challengeCode: '11111',
    });
  }
  faceCompareToDocument(
    data: FaceCompareRequest,
  ): Promise<FaceCompareResponse> {
    return Promise.resolve({
      imgs: {
        img_face:
          'idg20240530-19adfd1b-2a16-1c17-e063-63199f0a7bf7/IDG01_5010e5ff-1ea0-11ef-8596-3f5ddfda7e03',
        img_front:
          'idg20240530-19adfd1b-2a16-1c17-e063-63199f0a7bf7/IDG01_3c649540-1ea0-11ef-b69d-bb2c3c49ce77',
      },
      dataSign:
        'aXOCepOxmg10SsB8knMcRq5YB3J8ugPXYK1p6/n1hKwyNtFWFtNHXZQgL1HYwq/vq1hxxZbGlJ1LaDGTmIsEJQ==',
      dataBase64:
        'eyJpbWdzIjp7ImltZ19mYWNlIjoiaWRnMjAyNDA1MzAtMTlhZGZkMWItMmExNi0xYzE3LWUwNjMtNjMxOTlmMGE3YmY3L0lERzAxXzUwMTBlNWZmLTFlYTAtMTFlZi04NTk2LTNmNWRkZmRhN2UwMyIsImltZ19mcm9udCI6ImlkZzIwMjQwNTMwLTE5YWRmZDFiLTJhMTYtMWMxNy1lMDYzLTYzMTk5ZjBhN2JmNy9JREcwMV8zYzY0OTU0MC0xZWEwLTExZWYtYjY5ZC1iYjJjM2M0OWNlNzcifSwibWVzc2FnZSI6IklERy0wMDAwMDAwMCIsInNlcnZlcl92ZXJzaW9uIjoiMS41LjE1Iiwib2JqZWN0Ijp7InJlc3VsdCI6IktodcO0biBt4bq3dCBraOG7m3AgOTcuNDY4JSIsIm1zZyI6Ik1BVENIIiwicHJvYiI6OTcuNDY4LCJtYXRjaF93YXJuaW5nIjoibm8iLCJtdWx0aXBsZV9mYWNlcyI6ZmFsc2V9LCJzdGF0dXNDb2RlIjoyMDAsImNoYWxsZW5nZUNvZGUiOiIxMTExMSJ9',
      logID: '21e22050-1ea1-11ef-a22b-9373b0e75eec-025d136f-Zuulserver',
      message: 'IDG-00000000',
      server_version: '1.5.15',
      object: {
        result: 'Khuôn mặt khớp 97.468%',
        msg: 'MATCH',
        prob: 97.468,
        match_warning: 'no',
        multiple_faces: false,
      },
      statusCode: 200,
      challengeCode: '11111',
    });
  }
}
