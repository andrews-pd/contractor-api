import { Request, Response, NextFunction } from "express";
import ContractController from "../../../src/controllers/ContractController";
import ContractService from "../../../src/services/ContractService";

jest.mock("../../../src/services/ContractService");

describe("ContractController", () => {
  let controller: ContractController;
  let mockGetById: jest.Mock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockGetById = jest.fn();
    (ContractService as jest.Mock).mockImplementation(() => ({
      getById: mockGetById,
    }));

    controller = new ContractController();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should return contract with status 200", async () => {
    const fakeContract = { id: 1, terms: "some terms" };
    mockGetById.mockResolvedValue(fakeContract);

    req = {
      params: { id: "1" },
      body: { profile: { id: 1, type: "client" } },
    };

    await controller.getContractById(
      req as Request,
      res as Response,
      next as NextFunction
    );

    expect(mockGetById).toHaveBeenCalledWith(1, { id: 1, type: "client" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeContract);
  });

  it("should call next with error if service throws", async () => {
    const error = new Error("Something went wrong");
    mockGetById.mockRejectedValue(error);

    req = {
      params: { id: "1" },
      body: { profile: { id: 1, type: "client" } },
    };

    await controller.getContractById(
      req as Request,
      res as Response,
      next as NextFunction
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});