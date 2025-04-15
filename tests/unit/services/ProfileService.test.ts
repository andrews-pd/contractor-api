import ProfileService from '../../../src/services/ProfileService';
import Profile from '../../../src/database/models/Profile';
import Job from '../../../src/database/models/Job';
import db from '../../../src/database/models';
import md5 from 'md5';
import { sign } from '../../../src/jwt/jwt';

jest.mock('../../../src/database/models');
jest.mock('md5');
jest.mock('../../../src/jwt/jwt');

jest.mock('../../../src/database/models/Profile', () => {
  return {
    findOne: jest.fn(),
  };
});

jest.mock('../../../src/database/models/Job', () => {
  return {
    findAll: jest.fn(),
  };
});

jest.mock('../../../src/database/models/Contract', () => {
  return {};
});

describe('ProfileService', () => {
  describe('login', () => {
    let profileService: ProfileService;

    beforeEach(() => {
      profileService = new ProfileService();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return token for valid credentials', async () => {
      const mockProfile = { id: 1, email: 'test@example.com', type: 'client' };
      (md5 as jest.Mock).mockReturnValue('hashedPassword');
      (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);
      (sign as jest.Mock).mockReturnValue('token123');

      const result = await profileService.login('test@example.com', 'password');

      expect(md5).toHaveBeenCalledWith('password');
      expect(Profile.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com', password: 'hashedPassword' },
      });
      expect(sign).toHaveBeenCalledWith({ id: 1, email: 'test@example.com', type: 'client' });
      expect(result).toEqual({ id: 1, email: 'test@example.com', token: 'token123' });
    });

    it('should return error message for invalid credentials', async () => {
      (md5 as jest.Mock).mockReturnValue('hashedPassword');
      (Profile.findOne as jest.Mock).mockResolvedValue(null);

      const result = await profileService.login('test@example.com', 'wrongpassword');

      expect(result).toEqual({ message: 'Invalid email or password' });
    });
  });

  describe('getById', () => {
    const profileService = new ProfileService();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the profile when found', async () => {
      const mockProfile = { id: 1, email: 'test@example.com', type: 'client' };

      (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const result = await profileService.getById(1);

      expect(Profile.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProfile);
    });

    it('should return null when profile is not found', async () => {
      (Profile.findOne as jest.Mock).mockResolvedValue(null);

      const result = await profileService.getById(999);

      expect(Profile.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe('deposit', () => {
    let profileService: ProfileService;
    let transactionMock: any;

    beforeEach(() => {
      profileService = new ProfileService();
      transactionMock = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      (db.transaction as jest.Mock).mockResolvedValue(transactionMock);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should process deposit successfully', async () => {
      const clientMock = {
        id: 1,
        type: 'client',
        balance: 100,
        save: jest.fn(),
      };
      const jobsMock = [{ price: 400 }, { price: 200 }];

      (Profile.findOne as jest.Mock).mockResolvedValue(clientMock);
      (Job.findAll as jest.Mock).mockResolvedValue(jobsMock);

      await profileService.deposit(1, 100);

      expect(clientMock.balance).toBe(200);
      expect(clientMock.save).toHaveBeenCalledWith({ transaction: transactionMock });
      expect(transactionMock.commit).toHaveBeenCalled();
    });

    it('should throw error if client not found', async () => {
      (Profile.findOne as jest.Mock).mockResolvedValue(null);

      await expect(profileService.deposit(1, 100)).rejects.toThrow('Client not found');
      expect(transactionMock.rollback).toHaveBeenCalled();
    });

    it('should throw error if user is not a client', async () => {
      const nonClientMock = { id: 1, type: 'contractor' };
      (Profile.findOne as jest.Mock).mockResolvedValue(nonClientMock);

      await expect(profileService.deposit(1, 100)).rejects.toThrow('Only clients can deposit');
      expect(transactionMock.rollback).toHaveBeenCalled();
    });

    it('should throw error for negative deposit amount', async () => {
      const clientMock = {
        id: 1,
        type: 'client',
        balance: 100,
        save: jest.fn(),
      };
      (Profile.findOne as jest.Mock).mockResolvedValue(clientMock);

      await expect(profileService.deposit(1, -50)).rejects.toThrow('Deposit amount must be positive');
      expect(transactionMock.rollback).toHaveBeenCalled();
    });

    it('should throw error if no jobs in progress', async () => {
      const clientMock = {
        id: 1,
        type: 'client',
        balance: 100,
        save: jest.fn(),
      };
      (Profile.findOne as jest.Mock).mockResolvedValue(clientMock);
      (Job.findAll as jest.Mock).mockResolvedValue([]);

      await expect(profileService.deposit(1, 100)).rejects.toThrow('No jobs in progress');
      expect(transactionMock.rollback).toHaveBeenCalled();
    });

    it('should throw error if deposit exceeds 25% of unpaid jobs', async () => {
      const clientMock = {
        id: 1,
        type: 'client',
        balance: 100,
        save: jest.fn(),
      };
      const jobsMock = [{ price: 100 }];
      (Profile.findOne as jest.Mock).mockResolvedValue(clientMock);
      (Job.findAll as jest.Mock).mockResolvedValue(jobsMock);

      await expect(profileService.deposit(1, 30)).rejects.toThrow('Deposit amount exceeds 25% of unpaid jobs');
      expect(transactionMock.rollback).toHaveBeenCalled();
    });
  });
});
