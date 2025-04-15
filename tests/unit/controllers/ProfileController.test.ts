import { Request, Response, NextFunction } from 'express';
import ProfileController from '../../../src/controllers/ProfileController';
import ProfileService from '../../../src/services/ProfileService';

jest.mock('../../../src/services/ProfileService');

const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
} as unknown as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('ProfileController', () => {
  let profileController: ProfileController;
  let profileServiceMock: jest.Mocked<ProfileService>;

  beforeEach(() => {
    profileController = new ProfileController();
    profileServiceMock = (profileController as any).profileService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 200 and profile data on successful login', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'password123' });
      const res = mockResponse();

      const mockProfile = { id: 1, email: 'test@example.com', name: 'Test User' } as any;
      profileServiceMock.login.mockResolvedValue(mockProfile);

      await profileController.login(req, res, mockNext);

      expect(profileServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfile);
    });

    it('should return 401 if login fails', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' });
      const res = mockResponse();

      profileServiceMock.login.mockResolvedValue({ message: 'Invalid credentials' });

      await profileController.login(req, res, mockNext);

      expect(profileServiceMock.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should call next with error if service throws', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'password123' });
      const res = mockResponse();
      const error = new Error('Service error');

      profileServiceMock.login.mockRejectedValue(error);

      await profileController.login(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deposit', () => {
    it('should return 201 on successful deposit', async () => {
      const req = mockRequest({ amount: 100 }, { userId: '1' });
      const res = mockResponse();

      profileServiceMock.deposit.mockResolvedValue();

      await profileController.deposit(req, res, mockNext);

      expect(profileServiceMock.deposit).toHaveBeenCalledWith(1, 100);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deposite  processed' });
    });

    it('should call next with error if service throws', async () => {
      const req = mockRequest({ amount: 100 }, { userId: '1' });
      const res = mockResponse();
      const error = new Error('Service error');

      profileServiceMock.deposit.mockRejectedValue(error);

      await profileController.deposit(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
