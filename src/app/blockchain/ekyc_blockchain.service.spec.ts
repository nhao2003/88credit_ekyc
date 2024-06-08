import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainService } from './blockchain.service';
import { EkycBlockchainService } from './ekyc_blockchain.service';
import { OrganizationStatus } from './types';

describe('EkycBlockchainService', () => {
  let service: EkycBlockchainService;

  beforeEach(async () => {
    service = new EkycBlockchainService();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should return all organizations', async () => {
    const organizations = await service.getAllOrganizations(1);
    expect(organizations).toBeDefined();
    expect(organizations.length).toBeGreaterThan(0);
  });

  it('should add a new organization', async () => {
    const organization = await service.addOrganization({
      email: (Math.random() * 1000).toString() + '@test.com',
      id_: '123',
      ifscCode: '123',
      kycCount: 0,
      name: 'Test Organization',
      status: OrganizationStatus.Active,
    });
    expect(organization).toBeDefined();
  });
});
