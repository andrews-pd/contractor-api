import JobService from '../../../src/services/JobService';
import Job from '../../../src/database/models/Job';
import Contract from '../../../src/database/models/Contract';
import { ProfileType } from '../../../src/interfaces/IProfile';

describe('JobService - getAllUnpaid', () => {
  const mockJobs = [
    { id: 1, description: 'Test Job 1', paid: false },
    { id: 2, description: 'Test Job 2', paid: false },
  ];

  let jobService: JobService;

  beforeEach(() => {
    jobService = new JobService();
    jest.clearAllMocks();
  });

  it('should return unpaid jobs for a Client profile', async () => {
    const profile = { id: 1, type: ProfileType.Client };

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockJobs as any);

    const result = await jobService.getAllUnpaid(profile);

    expect(Job.findAll).toHaveBeenCalledWith({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          where: {
            ClientId: 1,
          },
        },
      ],
    });

    expect(result).toEqual(mockJobs);
  });

  it('should return unpaid jobs for a Contractor profile', async () => {
    const profile = { id: 2, type: ProfileType.Contractor };

    jest.spyOn(Job, 'findAll').mockResolvedValue(mockJobs as any);

    const result = await jobService.getAllUnpaid(profile);

    expect(Job.findAll).toHaveBeenCalledWith({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          where: {
            ContractorId: 2,
          },
        },
      ],
    });

    expect(result).toEqual(mockJobs);
  });

  it('should return an empty array if no unpaid jobs are found', async () => {
    const profile = { id: 3, type: ProfileType.Client };

    jest.spyOn(Job, 'findAll').mockResolvedValue([]);

    const result = await jobService.getAllUnpaid(profile);

    expect(result).toEqual([]);
  });

  it('should throw an error if findAll fails', async () => {
    const profile = { id: 4, type: ProfileType.Client };

    jest.spyOn(Job, 'findAll').mockRejectedValue(new Error('Database error'));

    await expect(jobService.getAllUnpaid(profile)).rejects.toThrow('Database error');
  });
});
