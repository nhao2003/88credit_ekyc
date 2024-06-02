import e from 'express';
import { ImageExtractRequest } from './image-extract-request.type';

export type FrontImageExtractRequest = ImageExtractRequest & {
  img_front: string;
  validate_postcode: boolean;
};

export interface FrontImageReponse {
  imgs: Imgs;
  dataSign: string;
  dataBase64: string;
  logID: string;
  message: string;
  server_version: string;
  object: FrontImageReponseObject;
  statusCode: number;
  challengeCode: string;
}

export interface Imgs {
  img_front: string;
}

export interface FrontImageReponseObject {
  origin_location: string;
  msg: string;
  name_prob: number;
  gender: string;
  name_fake_warning_prob: number;
  cover_prob_front: number;
  expire_warning: string;
  address_fake_warning: boolean;
  valid_date_prob: number;
  nation_policy: string;
  origin_location_prob: number;
  corner_warning: string;
  general_warning: any[];
  valid_date: string;
  dupplication_warning: boolean;
  issue_date: string;
  id_fake_prob: number;
  checking_result_front: CheckingResultFront;
  id: string;
  id_probs: string;
  citizen_id_prob: number;
  dob_fake_warning_prob: number;
  birth_day_prob: number;
  issue_place: string;
  recent_location: string;
  id_fake_warning: string;
  dob_fake_warning: boolean;
  name_fake_warning: string;
  name_probs: number[];
  type_id: number;
  card_type: string;
  quality_front: QualityFront;
  birth_day: string;
  issue_date_prob: number;
  citizen_id: string;
  recent_location_prob: number;
  issue_place_prob: number;
  nationality: string;
  post_code: PostCode[];
  name: string;
  tampering: Tampering;
}

export interface CheckingResultFront {
  corner_cut_result: string;
  edited_prob: number;
  recaptured_result: string;
  check_photocopied_prob: number;
  corner_cut_prob: number[];
  check_photocopied_result: string;
  edited_result: string;
  recaptured_prob: number;
}

export interface QualityFront {
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

export interface PostCode {
  debug: string;
  city: [string, string, number];
  district: [string, string, number];
  ward: [string, string, number];
  detail: string;
  type: string;
}

export interface Tampering {
  is_legal: string;
  warning: any[];
}
