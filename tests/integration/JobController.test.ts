import { Request, Response, NextFunction } from 'express';
import JobController from '../../src/controllers/JobController';
import JobService from '../../src/services/JobService';

jest.mock('../../src/services/JobService');

describe('JobController - getContractById', () => {
  let controller: JobController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new JobController();
    mockReq = {
      body: { profile: { id: 1, email: 'client@example.com', type: 'client' } },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('getContractById', () => {
    it('should return jobs with status 200 when successful', async () => {
      const mockJobs = [{ id: 1, description: 1, paid: true }];
      (JobService.prototype.getAllUnpaid as jest.Mock).mockResolvedValue(mockJobs);

      await controller.getAllUnpaid(mockReq as Request, mockRes as Response, mockNext);

      expect(JobService.prototype.getAllUnpaid).toHaveBeenCalledWith(mockReq.body.profile);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockJobs);
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Database failure');
      (JobService.prototype.getAllUnpaid as jest.Mock).mockRejectedValue(error);

      await controller.getAllUnpaid(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('payJob', () => {
    it('should return status 201 and the updated job when successful', async () => {
      const mockJob = { id: 1, description: 'Test Job', message: "Job paid successfully" };
      mockReq.params = { job_id: '1' };
      (JobService.prototype.payJob as jest.Mock).mockResolvedValue(mockJob);

      await controller.payJob(mockReq as Request, mockRes as Response, mockNext);

      expect(JobService.prototype.payJob).toHaveBeenCalledWith(1, mockReq.body.profile);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockJob.message });
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Payment failed');
      mockReq.params = { job_id: '1' };
      (JobService.prototype.payJob as jest.Mock).mockRejectedValue(error);

      await controller.payJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should call next with error if job_id is not a number', async () => {
      mockReq.params = { job_id: 'invalid' };

      await controller.payJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with error if profile is missing', async () => {
      mockReq.body = {};
      mockReq.params = { job_id: '1' };

      await controller.payJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with error if job_id is missing', async () => {
      mockReq.params = {};

      await controller.payJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
