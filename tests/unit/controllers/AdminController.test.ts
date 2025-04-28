import { Request, Response, NextFunction } from 'express';
import AdminController from '../../../src/controllers/AdminController';
import AdminService from '../../../src/services/AdminService';
import Job from '../../../src/database/models/Job';

jest.mock('../../../src/services/AdminService');

describe('AdminController', () => {
  let adminController: AdminController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  const getBestProfession = jest.fn();
  const getBestClients = jest.fn();

  beforeEach(() => {
    adminController = new AdminController({ getBestProfession, getBestClients } as unknown as AdminService);
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('getBestProfession', () => {
    it('should return the best profession with status 200', async () => {
      req.query = { start: '2023-01-01', end: '2023-12-31' };
      const mockProfession = { profession: 'Engineer', earnings: 10000 } as unknown as Job;
      getBestProfession.mockResolvedValue(mockProfession);

      await adminController.getBestProfession(req as Request, res as Response, next);

      expect(getBestProfession).toHaveBeenCalledWith('2023-01-01', '2023-12-31');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfession);
    });

    it('should call next with an error if service throws', async () => {
      req.query = { start: '2023-01-01', end: '2023-12-31', limit: '3' };
      const error = new Error('Service error');
      getBestProfession.mockRejectedValue(error);

      await adminController.getBestProfession(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients with status 200', async () => {
      req.query = { start: '2023-01-01', end: '2023-12-31', limit: '3' };
      const mockClients = [
        { id: 1, name: 'Client A', paid: 5000 },
        { id: 2, name: 'Client B', paid: 3000 },
      ] as unknown as Job[];
      getBestClients.mockResolvedValue(mockClients);

      await adminController.getBestClients(req as Request, res as Response, next);

      expect(getBestClients).toHaveBeenCalledWith('2023-01-01', '2023-12-31', 3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClients);
    });

    it('should use default limit if limit is not a valid number', async () => {
      req.query = { start: '2023-01-01', end: '2023-12-31', limit: '-1' };
      const mockClients = [
        { id: 1, name: 'Client A', paid: 5000 },
        { id: 2, name: 'Client B', paid: 3000 },
      ] as unknown as Job[];
      getBestClients.mockResolvedValue(mockClients);

      await adminController.getBestClients(req as Request, res as Response, next);

      expect(getBestClients).toHaveBeenCalledWith('2023-01-01', '2023-12-31', 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClients);
    });

    it('should call next with an error if service throws', async () => {
      req.query = { start: '2023-01-01', end: '2023-12-31', limit: '3' };
      const error = new Error('Service error');
      getBestClients.mockRejectedValue(error);

      await adminController.getBestClients(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});