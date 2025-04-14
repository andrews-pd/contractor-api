import { Request, Response, NextFunction } from 'express';
import ContractController from '../../src/controllers/ContractController';
import ContractService from '../../src/services/ContractService';
import { ContractStatus } from '../../src/interfaces/IContract';

jest.mock('../../src/services/ContractService');

describe('ContractController - getContractById', () => {
  let controller: ContractController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new ContractController();
    mockReq = {
      params: { id: '1' },
      body: { profile: { id: 1, email: 'client@example.com', type: 'client' } }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should return contract with status 200 when successful', async () => {
    const mockContract = { id: 1, clientId: 1, contractorId: 2, status: ContractStatus.InProgress };
    (ContractService.prototype.getById as jest.Mock).mockResolvedValue(mockContract);

    await controller.getContractById(mockReq as Request, mockRes as Response, mockNext);

    expect(ContractService.prototype.getById).toHaveBeenCalledWith(1, mockReq.body.profile);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockContract);
  });

  it('should call next with error if service throws', async () => {
    const error = new Error('Database failure');
    (ContractService.prototype.getById as jest.Mock).mockRejectedValue(error);

    await controller.getContractById(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('ContractController - getContracts', () => {
  let controller: ContractController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new ContractController();
    mockReq = {
      params: { id: '1' },
      body: { profile: { id: 1, email: 'client@example.com', type: 'client' } }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should return contract with status 200 when successful', async () => {
    const mockContract = [{ id: 1, clientId: 1, contractorId: 2, status: ContractStatus.InProgress }];
    (ContractService.prototype.getAll as jest.Mock).mockResolvedValue(mockContract);

    await controller.getContracts(mockReq as Request, mockRes as Response, mockNext);

    expect(ContractService.prototype.getAll).toHaveBeenCalledWith(mockReq.body.profile);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockContract);
  });

  it('should call next with error if service throws', async () => {
    const error = new Error('Database failure');
    (ContractService.prototype.getAll as jest.Mock).mockRejectedValue(error);

    await controller.getContractById(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});