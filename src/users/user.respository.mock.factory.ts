import { Repository } from 'typeorm';
import { MockType } from '../../test/mock.type';

export const userRepositoryMockFactory: () => MockType<Repository<any>> =
  jest.fn(() => ({
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIds: jest.fn(),
    delete: jest.fn(),
  }));
