import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('BFF Gateway is running!'),
            getStatus: jest.fn().mockReturnValue({ status: 'OK' }),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return hello message', () => {
    expect(appController.getHello()).toBe('BFF Gateway is running!');
  });

  it('should return status', () => {
    const result = appController.getStatus();
    expect(result).toHaveProperty('status');
  });
});
