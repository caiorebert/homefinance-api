import { Test, TestingModule } from '@nestjs/testing';
import { BalancoService } from './balanco.service';

describe('BalancoService', () => {
  let service: BalancoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalancoService],
    }).compile();

    service = module.get<BalancoService>(BalancoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
