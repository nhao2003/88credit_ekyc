// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const HDWalletProvider = require('@truffle/hdwallet-provider');
// import { KYCServiceInterface } from './interfaces';
// import {
//   User,
//   KycRequest,
//   Organization,
//   Customer,
//   KycStatus,
//   DataHashStatus,
// } from './types';
// import { readFileSync } from 'fs';
// import { Web3 } from 'web3';
// import * as ethers from 'ethers';
// import { Logger } from '@nestjs/common';
// const mnemonic =
//   'mosquito bind toe kit reward math embrace rally sing acoustic rally matrix';
// export class EkycBlockchainService implements KYCServiceInterface {
//   private contract: any;
//   private accountAddress: string = '0x418EDE79a5E0045185794a4cC3300e356318a704';
//   private logger: Logger = new Logger('EkycBlockchainService');
//   constructor() {
//     const provider = new HDWalletProvider({
//       mnemonic,
//       providerOrUrl: 'http://localhost:7545',
//     }); // Use 'any' as a workaround to bypass type check
//     const web3 = new Web3(provider as any);
//     const contractAbi = JSON.parse(
//       readFileSync('blockchain/build/KYC.json', 'utf8'),
//     ).abi;
//     this.contract = new web3.eth.Contract(
//       contractAbi,
//       '0x12FE46f468d2d383A56C4d2Eb2c627555db01ac1',
//     );
//   }
//   admin(): Promise<string> {
//     throw new Error('Method not implemented.');
//   }
//   userList(index: number): Promise<string> {
//     throw new Error('Method not implemented.');
//   }
//   users(address: string): Promise<User> {
//     throw new Error('Method not implemented.');
//   }
//   kycRequests(reqId: string): Promise<KycRequest> {
//     throw new Error('Method not implemented.');
//   }
//   organizationCustomers(address: string, index: number): Promise<string> {
//     throw new Error('Method not implemented.');
//   }
//   customerorganizations(address: string, index: number): Promise<string> {
//     throw new Error('Method not implemented.');
//   }
//   getAllOrganizations(pageNumber: number): Promise<[number, Organization[]]> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .getAllOrganizations(pageNumber)
//         .call({
//           from: this.accountAddress,
//         })
//         .then((result: any) => {
//           resolve([result[0], result[1]]);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   addOrganization(organization: Partial<Organization>): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .addOrganization(organization)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   updateOrganizationDetails(
//     id: string,
//     email: string,
//     name: string,
//   ): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .updateOrganizationDetails(id, email, name)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   activateDeactivateOrganization(
//     id: string,
//     makeActive: boolean,
//   ): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .activateDeactivateOrganization(id, makeActive)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   getCustomersOfOrganization(
//     pageNumber: number,
//   ): Promise<[number, KycRequest[]]> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .getCustomersOfOrganization(pageNumber)
//         .call({
//           from: this.accountAddress,
//         })
//         .then((result: any) => {
//           resolve([result[0], result[1]]);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   addKycRequest(
//     customer: Customer,
//     currentTime: number,
//     notes: string,
//   ): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .addKycRequest(customer, currentTime, notes)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   reRequestForKycRequest(id: string, notes: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .reRequestForKycRequest(id, notes)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   updateKycVerification(
//     userId: string,
//     verified: boolean,
//     note: string,
//   ): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .updateKycVerification(userId, verified, note)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }

//   searchCustomers(id: string): Promise<[boolean, Customer, KycRequest]> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .searchCustomers(id)
//         .call({
//           from: this.accountAddress,
//         })
//         .then((result: any) => {
//           resolve(result);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   getOrganizationRequests(
//     uid: string,
//     pageNumber: number,
//   ): Promise<[number, KycRequest[]]> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .getOrganizationRequests(pageNumber)
//         .call({
//           from: uid,
//         })
//         .then((result: any) => {
//           resolve([result[0], result[1]]);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   actionOnKycRequest(
//     organizationId: string,
//     approve: boolean,
//     note: string,
//   ): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .actionOnKycRequest(organizationId, approve, note)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           this.logger.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   updateProfile(name: string, email: string, mobile: number): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .updateProfile(name, email, mobile)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   updateDatahash(hash: string, currentTime: number): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .updateDatahash(hash, currentTime)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   removerDatahashPermission(
//     organizationId: string,
//     notes: string,
//   ): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .removerDatahashPermission(organizationId, notes)
//         .send({
//           from: this.accountAddress,
//         })
//         .then((res) => {
//           console.log('res', res);
//           resolve();
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   searchOrganizations(
//     organizationId: string,
//   ): Promise<[boolean, Organization, KycRequest]> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .searchOrganizations(organizationId)
//         .call({
//           from: this.accountAddress,
//         })
//         .then((result: any) => {
//           resolve(result);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   whoAmI(): Promise<User> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .whoAmI()
//         .call({
//           from: this.accountAddress,
//         })
//         .then((result: any) => {
//           resolve(result);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   getCustomerDetails(id: string): Promise<Customer> {
//     console.log('id', id);
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .getCustomerDetails(id)
//         .call({
//           from: this.accountAddress,
//         })
//         .then((result: any) => {
//           resolve(result);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   getOrganizationDetails(id: string): Promise<Organization> {
//     return new Promise((resolve, reject) => {
//       this.contract.methods
//         .getOrganizationDetails(id)
//         .call({
//           from: this.accountAddress,
//         })
//         .then((result: any) => {
//           resolve(result);
//         })
//         .catch((error: any) => {
//           reject(error);
//         });
//     });
//   }
//   on(
//     event: 'KycRequestAdded',
//     listener: (
//       reqId: string,
//       organizationName: string,
//       customerName: string,
//     ) => void,
//   ): void;
//   on(
//     event: 'KycReRequested',
//     listener: (
//       reqId: string,
//       organizationName: string,
//       customerName: string,
//     ) => void,
//   ): void;
//   on(
//     event: 'KycStatusChanged',
//     listener: (
//       reqId: string,
//       customerId: string,
//       organizationId: string,
//       status: KycStatus,
//     ) => void,
//   ): void;
//   on(
//     event: 'DataHashPermissionChanged',
//     listener: (
//       reqId: string,
//       customerId: string,
//       organizationId: string,
//       status: DataHashStatus,
//     ) => void,
//   ): void;
//   on(event: unknown, listener: unknown): void {
//     throw new Error('Method not implemented.');
//   }
// }
