import { Test, TestingModule } from '@nestjs/testing';
import { BalancoController } from './balanco.controller';

describe('BalancoController', () => {
  let controller: BalancoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalancoController],
    }).compile();

    controller = module.get<BalancoController>(BalancoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
