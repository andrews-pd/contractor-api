import { Request, Response, NextFunction } from 'express';
import ProfileController from '../../src/controllers/ProfileController';
import ProfileService from '../../src/services/ProfileService';

jest.mock('../../src/services/ProfileService');

describe('ProfileController - login', () => {
  let controller: ProfileController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new ProfileController();
    mockReq = {
      body: { email: 'test@example.com', password: '123456' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should respond with status 200 and profile data on successful login', async () => {
    const mockProfile = { id: 1, email: 'test@example.com', type: 'client' };
    (ProfileService.prototype.login as jest.Mock).mockResolvedValue(mockProfile);

    await controller.login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockProfile);
  });

  it('should respond with status 401 if service returns an error message', async () => {
    const mockResponse = { message: 'Invalid credentials' };
    (ProfileService.prototype.login as jest.Mock).mockResolvedValue(mockResponse);

    await controller.login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should call next with error if an exception is thrown', async () => {
    const error = new Error('Something went wrong');
    (ProfileService.prototype.login as jest.Mock).mockRejectedValue(error);

    await controller.login(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
