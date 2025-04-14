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
      body: { profile: { id: 1, email: 'client@example.com', type: 'client' } }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

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
