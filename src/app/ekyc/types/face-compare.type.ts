export interface FaceCompareRequest {
  img_front: string;
  img_face: string;
  client_session: string;
  token: string;
}

export interface FaceCompareResponse {
  imgs: Imgs;
  dataSign: string;
  dataBase64: string;
  logID: string;
  message: string;
  server_version: string;
  object: FaceCompareResponseObject;
  statusCode: number;
  challengeCode: string;
}

export interface Imgs {
  img_face: string;
  img_front: string;
}

export interface FaceCompareResponseObject {
  result: string;
  msg: 'NOMATCH' | 'MATCH';
  prob: number;
  match_warning: string;
  multiple_faces: boolean;
}
