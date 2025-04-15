import { Request, Response, NextFunction } from 'express';
import AdminController from '../../../src/controllers/AdminController';
import AdminService from '../../../src/services/AdminService';

jest.mock('../../../src/services/AdminService');

describe('AdminController', () => {
  let adminController: AdminController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    adminController = new AdminController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('getBestProfession', () => {
    it('should return 400 if start or end date is missing', async () => {
      mockRequest.query = {};

      await adminController.getBestProfession(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Start and end dates are required',
      });
    });

    it('should return 400 if start or end date is not a string', async () => {
      mockRequest.query = { start: 123, end: 456 } as any;

      await adminController.getBestProfession(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Start and end dates must be strings',
      });
    });

    it('should return 400 if date format is invalid', async () => {
      mockRequest.query = { start: 'invalid-date', end: 'invalid-date' };

      await adminController.getBestProfession(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid date format',
      });
    });

    it('should return 400 if start date is after or equal to end date', async () => {
      mockRequest.query = { start: '2023-10-10', end: '2023-10-01' };

      await adminController.getBestProfession(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Start date must be before end date',
      });
    });

    it('should return 200 with the best profession', async () => {
      const mockProfession = { profession: 'Engineer', earnings: 1000 };
      (AdminService.prototype.getBestProfession as jest.Mock).mockResolvedValue(mockProfession);

      mockRequest.query = { start: '2023-01-01', end: '2023-12-31' };

      await adminController.getBestProfession(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProfession);
    });

    it('should call next with an error if an exception is thrown in getBestProfession', async () => {
      const mockError = new Error('Unexpected error');
      (AdminService.prototype.getBestProfession as jest.Mock).mockImplementation(() => {
        throw mockError;
      });
    
      mockRequest.query = { start: '2023-01-01', end: '2023-12-31' };
    
      await adminController.getBestProfession(mockRequest as Request, mockResponse as Response, mockNext);
    
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getBestClients', () => {
    it('should return 200 with the best clients', async () => {
      const mockClients = [
        { id: 1, name: 'Client A', paid: 500 },
        { id: 2, name: 'Client B', paid: 300 },
      ];
      (AdminService.prototype.getBestClients as jest.Mock).mockResolvedValue(mockClients);
    
      mockRequest.query = { start: '2023-01-01', end: '2023-12-31', limit: 2 } as any;
    
      await adminController.getBestClients(mockRequest as Request, mockResponse as Response, mockNext);
    
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockClients);
    });

    it('should return 400 if start or end date is missing', async () => {
      mockRequest.query = {};

      await adminController.getBestClients(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Start and end dates are required',
      });
    });

    it('should return 400 if start or end date is not a string', async () => {
      mockRequest.query = { start: 123, end: 456 } as any;

      await adminController.getBestClients(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Start and end dates must be strings',
      });
    });

    it('should return 400 if date format is invalid', async () => {
      mockRequest.query = { start: 'invalid-date', end: 'invalid-date' };

      await adminController.getBestClients(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid date format',
      });
    });

    it('should return 400 if start date is after or equal to end date', async () => {
      mockRequest.query = { start: '2023-10-10', end: '2023-10-01' };

      await adminController.getBestClients(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Start date must be before end date',
      });
    });

    it('should call next with an error if limitNumber is less than or equal to 0', async () => {
      const mockError = new Error('Limit must be a positive number');
      (AdminService.prototype.getBestClients as jest.Mock).mockImplementation(() => {
        throw mockError;
      });
    
      mockRequest.query = { start: '2023-01-01', end: '2023-12-31', limit: 0 } as any;
    
      await adminController.getBestClients(mockRequest as Request, mockResponse as Response, mockNext);
    
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
