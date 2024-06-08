export enum Role {
  Admin,
  Organization,
  Customer,
}

export enum DataHashStatus {
  Pending, // 0
  Approved, // 1
  Rejected, // 2
}

export enum OrganizationStatus {
  Active,
  Inactive,
}

export enum KycStatus {
  Pending,
  KYCVerified,
  KYCFailed,
}

export type User = {
  name: string;
  email: string;
  id_: string;
  role: Role;
  status: OrganizationStatus;
};

export type Customer = {
  name: string;
  email: string;
  mobileNumber: string;
  id_: string;
  kycVerifiedBy: string;
  dataHash: string;
  dataUpdatedOn: number;
};

export type Organization = {
  name: string;
  email: string;
  id_: string;
  ifscCode: string;
  kycCount: number;
  status: OrganizationStatus;
};

export type KycRequest = {
  userId_: string;
  customerName: string;
  organizationId_: string;
  organizationName: string;
  dataHash: string;
  updatedOn: number;
  status: KycStatus;
  dataRequest: DataHashStatus; // Get approval from user to access the data
  additionalNotes: string;
};
