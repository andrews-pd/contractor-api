import { Request, Response, NextFunction } from 'express';
import ContractController from '../../../src/controllers/ContractController';
import ContractService from '../../../src/services/ContractService';

jest.mock('../../../src/services/ContractService');

describe('ContractController', () => {
  let controller: ContractController;
  let mockGetById: jest.Mock;
  let mockGetAll: jest.Mock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockGetById = jest.fn();
    mockGetAll = jest.fn();
    (ContractService as jest.Mock).mockImplementation(() => ({
      getById: mockGetById,
      getAll: mockGetAll
    }));

    controller = new ContractController();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getContractById', () => {
    it('should return contract with status 200', async () => {
      const fakeContract = { id: 1, terms: 'some terms' };
      mockGetById.mockResolvedValue(fakeContract);

      req = {
        params: { id: '1' },
        body: { profile: { id: 1, type: 'client' } },
      };

      await controller.getContractById(req as Request, res as Response, next as NextFunction);

      expect(mockGetById).toHaveBeenCalledWith(1, { id: 1, type: 'client' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeContract);
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Something went wrong');
      mockGetById.mockRejectedValue(error);

      req = {
        params: { id: '1' },
        body: { profile: { id: 1, type: 'client' } },
      };

      await controller.getContractById(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getContractById', () => {
    it('should return contracts with status 200', async () => {
      const fakeContracts = [{ id: 1, terms: 'some terms' }, { id: 2, terms: 'some other terms' }];
      mockGetAll.mockResolvedValue(fakeContracts);

      req = {
        body: { profile: { id: 1, type: 'client' } },
      };

      await controller.getContracts(req as Request, res as Response, next as NextFunction);

      expect(mockGetAll).toHaveBeenCalledWith({ id: 1, type: 'client' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeContracts);
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Something went wrong');
      mockGetAll.mockRejectedValue(error);

      req = {
        body: { profile: { id: 1, type: 'client' } },
      };

      await controller.getContracts(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
