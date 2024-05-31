import { Test, TestingModule } from '@nestjs/testing';
import { EkycService } from './ekyc.service';

describe('EkycService', () => {
  let service: EkycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EkycService],
    }).compile();

    service = module.get<EkycService>(EkycService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
