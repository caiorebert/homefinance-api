import { Test, TestingModule } from '@nestjs/testing';
import { CartaoController } from './cartao.controller';

describe('CartaoController', () => {
  let controller: CartaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartaoController],
    }).compile();

    controller = module.get<CartaoController>(CartaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
