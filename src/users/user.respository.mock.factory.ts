import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const userRepositoryMockFactory: () => MockType<Repository<any>> =
  jest.fn(() => ({
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIds: jest.fn(),
    delete: jest.fn(),
  }));
