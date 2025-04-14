import { Request, Response, NextFunction } from "express";
import JobController from "../../../src/controllers/JobController";
import JobService from "../../../src/services/JobService";

jest.mock("../../../src/services/JobService");

describe("JobController", () => {
  let jobController: JobController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jobController = new JobController();
    mockRequest = {
      body: {
        profile: { id: 1, type: "client" },
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUnpaid", () => {
    it("should return unpaid contracts and respond with status 200", async () => {
      const mockContracts = [{ id: 1, status: "unpaid" }];
      (JobService.prototype.getAllUnpaid as jest.Mock).mockResolvedValue(
        mockContracts
      );

      await jobController.getAllUnpaid(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(JobService.prototype.getAllUnpaid).toHaveBeenCalledWith(
        mockRequest.body.profile
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockContracts);
    });

    it("should call next with an error if service throws an error", async () => {
      const mockError = new Error("Service error");
      (JobService.prototype.getAllUnpaid as jest.Mock).mockRejectedValue(
        mockError
      );

      await jobController.getAllUnpaid(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(JobService.prototype.getAllUnpaid).toHaveBeenCalledWith(
        mockRequest.body.profile
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});