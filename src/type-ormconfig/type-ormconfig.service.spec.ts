import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMConfigService } from './type-ormconfig.service';

describe('TypeOrmconfigService', () => {
  let service: TypeORMConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeORMConfigService],
    }).compile();

    service = module.get<TypeORMConfigService>(TypeORMConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
