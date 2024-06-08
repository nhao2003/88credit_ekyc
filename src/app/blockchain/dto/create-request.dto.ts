export class CreateCustumerDto {
  name: string;
  email: string;
  mobileNumber: string;
  id_: string;
  kycVerifiedBy: string;
  dataHash: string;
  dataUpdatedOn: number;
}
export class CreateEkycRequest {
  customer: CreateCustumerDto;
  notes: string;
}
