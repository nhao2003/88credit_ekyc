// eslint-disable-next-line @typescript-eslint/no-var-requires
const HDWalletProvider = require('@truffle/hdwallet-provider');
import { KYCServiceInterface } from './interfaces';
import {
  User,
  KycRequest,
  Organization,
  Customer,
  KycStatus,
  DataHashStatus,
  OrganizationStatus,
} from './types';
import { readFileSync } from 'fs';
import { Web3 } from 'web3';
import * as ethers from 'ethers';
import { Inject, Injectable, Logger } from '@nestjs/common';
const mnemonic =
  'mosquito bind toe kit reward math embrace rally sing acoustic rally matrix';
BigInt.prototype['toJSON'] = function () {
  return parseInt(this.toString());
};
@Injectable()
export class BlockchainService implements KYCServiceInterface {
  private contract: any;
  private accountAddress: string = '0x418EDE79a5E0045185794a4cC3300e356318a704';
  private logger: Logger = new Logger('EkycBlockchainService');
  constructor() {
    const provider = new HDWalletProvider({
      mnemonic,
      providerOrUrl: 'http://localhost:7545',
    }); // Use 'any' as a workaround to bypass type check
    const web3 = new Web3(provider as any);
    const contractAbi = JSON.parse(
      readFileSync('blockchain/build/KYC.json', 'utf8'),
    ).abi;
    this.contract = new web3.eth.Contract(
      contractAbi,
      '0x519F4BB921cf5D638EaF149426E55B5eDbf1C1B1',
    );
  }
  admin(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  userList(index: number): Promise<string> {
    throw new Error('Method not implemented.');
  }
  users(address: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  kycRequests(reqId: string): Promise<KycRequest> {
    throw new Error('Method not implemented.');
  }
  organizationCustomers(address: string, index: number): Promise<string> {
    throw new Error('Method not implemented.');
  }
  customerorganizations(address: string, index: number): Promise<string> {
    throw new Error('Method not implemented.');
  }
  //#region Admin Functions
  getAllOrganizations(pageNumber: number): Promise<[number, Organization[]]> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .getAllOrganizations(pageNumber)
        .call({
          from: this.accountAddress,
        })
        .then((result: any) => {
          console.log('result', result);
          resolve([parseInt(result[0]), result[1]]);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  addOrganization(organization: Partial<Organization>): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: Organization = {
        id_: organization.id_,
        name: organization.name,
        email: organization.email,
        status: OrganizationStatus.Active,
        ifscCode: organization.ifscCode,
        kycCount: 0,
      };
      this.contract.methods
        .addOrganization(data)
        .send({
          from: this.accountAddress,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  updateOrganizationDetails(
    id: string,
    email: string,
    name: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .updateOrganizationDetails(id, email, name)
        .send({
          from: this.accountAddress,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  activateDeactivateOrganization(
    id: string,
    makeActive: boolean,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .activateDeactivateOrganization(id, makeActive)
        .send({
          from: this.accountAddress,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  getCustomersOfOrganization(
    oid: string,
    pageNumber: number,
  ): Promise<[number, KycRequest[]]> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .getCustomersOfOrganization(pageNumber)
        .call({
          from: oid,
        })
        .then((result: any) => {
          resolve([result[0], result[1]]);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  addKycRequest(
    oid: string,
    customer: Customer,
    currentTime: number,
    notes: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const cus: Customer = {
        id_: customer.id_,
        name: customer.name,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
        kycVerifiedBy: '0x0000000000000000000000000000000000000000',
        dataHash: '',
        dataUpdatedOn: 0,
      };
      this.contract.methods
        .addKycRequest(cus, currentTime, notes)
        .send({
          from: oid,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  reRequestForKycRequest(oid: string, id: string, notes: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .reRequestForKycRequest(id, notes)
        .send({
          from: oid,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  updateKycVerification(
    oid: string,
    userId: string,
    verified: boolean,
    note: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .updateKycVerification(userId, verified, note)
        .send({
          from: oid,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  searchCustomers(
    oid: string,
    id: string,
  ): Promise<[boolean, Customer, KycRequest]> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .searchCustomers(id)
        .call({
          from: oid,
        })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  //#endregion

  // #region Customer Functions
  getOrganizationRequests(
    uid: string,
    pageNumber: number,
  ): Promise<[number, KycRequest[]]> {
    console.log('pageNumber', pageNumber);
    return new Promise((resolve, reject) => {
      this.contract.methods
        .getOrganizationRequests(pageNumber)
        .call({
          from: uid,
        })
        .then((result: any) => {
          resolve([result[0], result[1]]);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  actionOnKycRequest(
    uid: string,
    organizationId: string,
    approve: boolean,
    note: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .actionOnKycRequest(organizationId, approve, note)
        .send({
          from: uid,
        })
        .then((res) => {
          this.logger.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  updateProfile(
    uid: string,
    name: string,
    email: string,
    mobile: number,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .updateProfile(name, email, mobile)
        .send({
          from: uid,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  updateDatahash(uid: string, hash: string, currentTime: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .updateDatahash(hash, currentTime)
        .send({
          from: uid,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  removerDatahashPermission(
    uid: string,
    organizationId: string,
    notes: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .removerDatahashPermission(organizationId, notes)
        .send({
          from: uid,
        })
        .then((res) => {
          console.log('res', res);
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  searchOrganizations(
    uid: string,
    organizationId: string,
  ): Promise<[boolean, Organization, KycRequest]> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .searchOrganizations(organizationId)
        .call({
          from: uid,
        })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  whoAmI(uid: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .whoAmI()
        .call({
          from: uid,
        })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  getCustomerDetails(id: string): Promise<Customer> {
    console.log('id', id);
    return new Promise((resolve, reject) => {
      this.contract.methods
        .getCustomerDetails(id)
        .call({
          from: this.accountAddress,
        })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  getOrganizationDetails(id: string): Promise<Organization> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .getOrganizationDetails(id)
        .call({
          from: this.accountAddress,
        })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
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
  on(event: unknown, listener: unknown): void {
    throw new Error('Method not implemented.');
  }
}
