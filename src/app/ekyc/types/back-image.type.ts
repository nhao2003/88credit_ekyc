import { ImageExtractRequest } from './image-extract-request.type';

export type BackImageExtractRequest = ImageExtractRequest & {
  img_back: string;
};

export interface BackImageReponse {
  imgs: Imgs;
  dataSign: string;
  dataBase64: string;
  logID: string;
  message: string;
  server_version: string;
  object: BackImageReponseObject;
  statusCode: number;
  challengeCode: string;
}

export interface Imgs {
  img_back: string;
}

export interface BackImageReponseObject {
  issue_place: string;
  issue_date_probs: number[];
  back_type_id: number;
  mrz_probs: number[];
  checking_result_back: CheckingResultBack;
  general_warning: any[];
  features: string;
  issue_date_prob: number;
  mrz_valid_score: number;
  issue_place_prob: number;
  issue_date: string;
  mrz: string[];
  quality_back: QualityBack;
  issuedate_fake_warning: boolean;
  back_corner_warning: string;
  mrz_prob: number;
  back_expire_warning: string;
  msg_back: string;
  features_prob: number;
}

export interface CheckingResultBack {
  corner_cut_result: string;
  edited_prob: number;
  recaptured_result: string;
  check_photocopied_prob: number;
  corner_cut_prob: number[];
  check_photocopied_result: string;
  edited_result: string;
  recaptured_prob: number;
}

export interface QualityBack {
  blur_score: number;
  bright_spot_param: BrightSpotParam;
  luminance_score: number;
  final_result: FinalResult;
  bright_spot_score: number;
  resolution: number[];
}

export interface BrightSpotParam {
  average_intensity: number;
  bright_spot_threshold: number;
  total_bright_spot_area: number;
}

export interface FinalResult {
  bad_luminance_likelihood: string;
  low_resolution_likelihood: string;
  blurred_likelihood: string;
  bright_spot_likelihood: string;
}
