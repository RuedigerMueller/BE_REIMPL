import { Repository } from 'typeorm';
import { MockType } from '../mock.type';

export const roleRepositoryMockFactory: () => MockType<Repository<any>> =
  jest.fn(() => ({
    save: jest.fn(),
  }));
