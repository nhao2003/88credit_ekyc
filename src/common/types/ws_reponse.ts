export enum WsReponseType {
  NEW = 'new',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface WsReponse<T = any> {
  type: WsReponseType;
  data: T;
}
