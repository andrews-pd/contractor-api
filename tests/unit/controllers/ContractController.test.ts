import { Request, Response, NextFunction } from 'express';
import ContractController from '../../../src/controllers/ContractController';
import ContractService from '../../../src/services/ContractService';

jest.mock('../../../src/services/ContractService');

describe("ContractController", () => {
  let contractController: ContractController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    contractController = new ContractController();

    mockRequest = {
      params: { id: "1" },
    };

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
    };

    mockNext = jest.fn();
  });

  it("should return the contract with status 200", async () => {
    const mockContract = { id: 1, name: "Test Contract" };
    (ContractService.prototype.getById as jest.Mock).mockResolvedValue(mockContract);

    await contractController.getContractById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockContract);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with an error if service throws", async () => {
    const mockError = new Error("Simulated error");
    (ContractService.prototype.getById as jest.Mock).mockRejectedValue(mockError);

    await contractController.getContractById(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});