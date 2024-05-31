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
  object: FaceResponseObject;
  statusCode: number;
  challengeCode: string;
}

export interface Imgs {
  img_face: string;
  img_front: string;
}

export interface FaceResponseObject {
  result: string;
  msg: string;
  prob: number;
  match_warning: string;
  multiple_faces: boolean;
}
