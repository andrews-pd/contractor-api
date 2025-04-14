import { Request, Response, NextFunction } from 'express';
import ProfileController from '../../../src/controllers/ProfileController';
import ProfileService from '../../../src/services/ProfileService';

jest.mock('../../../src/services/ProfileService');

describe('ProfileController', () => {
  let controller: ProfileController;
  let mockLogin: jest.Mock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockLogin = jest.fn();
    (ProfileService as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
    }));

    controller = new ProfileController();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('ProfileController - login', () => {
    it('should return 200 and the profile data when login is successful', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Partial<Request>;

      const profileData = { id: 1, name: 'Test User', email: 'test@example.com' };
      mockLogin.mockResolvedValue(profileData);

      await controller.login(req as Request, res as Response, next);

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(profileData);
    });

    it('should return 401 and an error message when login fails', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      } as Partial<Request>;

      const errorMessage = { message: 'Invalid credentials' };
      mockLogin.mockResolvedValue(errorMessage);

      await controller.login(req as Request, res as Response, next);

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });

    it('should call next with an error when an exception is thrown', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Partial<Request>;

      const error = new Error('Something went wrong');
      mockLogin.mockRejectedValue(error);

      await controller.login(req as Request, res as Response, next);

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
