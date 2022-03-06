import { Repository } from 'typeorm';
import { MockType } from '../helper/mock.type';

export const roleRepositoryMockFactory: () => MockType<Repository<any>> =
  jest.fn(() => ({
    save: jest.fn(),
    findOne: jest.fn(),
  }));
