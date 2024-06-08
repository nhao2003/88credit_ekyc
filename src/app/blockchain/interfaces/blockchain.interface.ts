import {
  User,
  KycRequest,
  Organization,
  Customer,
  KycStatus,
  DataHashStatus,
} from '../types';
// Define the KYC contract interface
export interface KYCServiceInterface {
  admin(): Promise<string>;
  userList(index: number): Promise<string>;

  users(address: string): Promise<User>;
  kycRequests(reqId: string): Promise<KycRequest>;
  organizationCustomers(address: string, index: number): Promise<string>;
  customerorganizations(address: string, index: number): Promise<string>;

  // Admin Functions
  getAllOrganizations(pageNumber: number): Promise<[number, Organization[]]>;
  addOrganization(organization: Organization): Promise<void>;
  updateOrganizationDetails(
    id: string,
    email: string,
    name: string,
  ): Promise<void>;
  activateDeactivateOrganization(
    id: string,
    makeActive: boolean,
  ): Promise<void>;

  // Organization Functions
  getCustomersOfOrganization(
    oid: string,
    pageNumber: number,
  ): Promise<[number, KycRequest[]]>;
  addKycRequest(
    oid: string,
    customer: Customer,
    currentTime: number,
    notes: string,
  ): Promise<void>;
  reRequestForKycRequest(oid: string, id: string, notes: string): Promise<void>;
  updateKycVerification(
    oid: string,
    userId: string,
    verified: boolean,
    note: string,
  ): Promise<void>;
  searchCustomers(
    oid: string,
    id: string,
  ): Promise<[boolean, Customer, KycRequest]>;

  // Customer Functions
  getOrganizationRequests(
    uid: string,
    pageNumber: number,
  ): Promise<[number, KycRequest[]]>;
  actionOnKycRequest(
    uid: string,
    organizationId: string,
    approve: boolean,
    note: string,
  ): Promise<void>;
  updateProfile(
    uid: string,
    name: string,
    email: string,
    mobile: number,
  ): Promise<void>;
  updateDatahash(uid: string, hash: string, currentTime: number): Promise<void>;
  removerDatahashPermission(
    uid: string,
    organizationId: string,
    notes: string,
  ): Promise<void>;
  searchOrganizations(
    uid: string,
    organizationId: string,
  ): Promise<[boolean, Organization, KycRequest]>;

  // Common Functions
  whoAmI(uid: string): Promise<User>;
  getCustomerDetails(id: string): Promise<Customer>;
  getOrganizationDetails(id: string): Promise<Organization>;

  // Events
  on(
    event: 'KycRequestAdded',
    listener: (
      reqId: string,
      organizationName: string,
      customerName: string,
    ) => void,
  ): void;
  on(
    event: 'KycReRequested',
    listener: (
      reqId: string,
      organizationName: string,
      customerName: string,
    ) => void,
  ): void;
  on(
    event: 'KycStatusChanged',
    listener: (
      reqId: string,
      customerId: string,
      organizationId: string,
      status: KycStatus,
    ) => void,
  ): void;
  on(
    event: 'DataHashPermissionChanged',
    listener: (
      reqId: string,
      customerId: string,
      organizationId: string,
      status: DataHashStatus,
    ) => void,
  ): void;
}
