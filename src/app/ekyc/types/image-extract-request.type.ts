export enum EkycFrontImageType {
  CMND = -1,
  HO_CHIEU = 5,
  BANG_LAI_XE = 6,
  CM_QUAN_DOI = 7,
}
export type ImageExtractRequest = {
  client_session: string;
  type: EkycFrontImageType;
  token: string;
};
