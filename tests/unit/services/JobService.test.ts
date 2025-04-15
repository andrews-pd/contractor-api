import JobService from '../../../src/services/JobService';
import Job from '../../../src/database/models/Job';
import Contract from '../../../src/database/models/Contract';
import { ProfileType } from '../../../src/interfaces/IProfile';
import Profile from '../../../src/database/models/Profile';
import db from '../../../src/database/models';

describe('JobService', () => {
  const mockJobs = [
    { id: 1, description: 'Test Job 1', paid: false },
    { id: 2, description: 'Test Job 2', paid: false },
  ];

  let jobService: JobService;

  beforeEach(() => {
    jobService = new JobService();
    jest.clearAllMocks();
  });

  describe('getAllUnpaid', () => {
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

  describe('payJob', () => {
    let jobService: JobService;

    beforeEach(() => {
      jobService = new JobService();
      jest.clearAllMocks();
    });

    it('should successfully pay a job', async () => {
      const profile = { id: 1, type: ProfileType.Client };
      const job = {
        id: 1,
        price: 100,
        paid: false,
        Contract: {
          Contractor: { id: 2, balance: 0, save: jest.fn() },
        },
        save: jest.fn(),
      };
      const client = { id: 1, balance: 200, save: jest.fn() };

      jest.spyOn(Job, 'findByPk').mockResolvedValue(job as any);
      jest.spyOn(Profile, 'findByPk').mockResolvedValue(client as any);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);

      await jobService.payJob(1, profile);

      expect(client.balance).toBe(100);
      expect(client.save).toHaveBeenCalled();
      expect(job.Contract.Contractor.balance).toBe(100);
      expect(job.Contract.Contractor.save).toHaveBeenCalled();
      expect(job.paid).toBe(true);
      expect(job.save).toHaveBeenCalled();
      expect(transaction.commit).toHaveBeenCalled();
    });

    it('should throw an error if the job is not found', async () => {
      const profile = { id: 1, type: ProfileType.Client };

      jest.spyOn(Job, 'findByPk').mockResolvedValue(null);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);

      await expect(jobService.payJob(1, profile)).rejects.toThrow('Job not found');
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw an error if the client has insufficient funds', async () => {
      const profile = { id: 1, type: ProfileType.Client };
      const job = {
        id: 1,
        price: 300,
        Contract: { Contractor: { id: 2, balance: 0, save: jest.fn() } },
      };
      const client = { id: 1, balance: 200, save: jest.fn() };

      jest.spyOn(Job, 'findByPk').mockResolvedValue(job as any);
      jest.spyOn(Profile, 'findByPk').mockResolvedValue(client as any);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);

      await expect(jobService.payJob(1, profile)).rejects.toThrow('Insufficient funds for the payment.');
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should rollback the transaction if an error occurs during payment', async () => {
      const profile = { id: 1, type: ProfileType.Client };
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };

      jest.spyOn(Job, 'findByPk').mockRejectedValue(new Error('Database error'));
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);

      await expect(jobService.payJob(1, profile)).rejects.toThrow('Database error');
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw an error if the client is not found', async () => {
      const profile = { id: 1, type: ProfileType.Client };
  
      jest.spyOn(Job, 'findByPk').mockResolvedValue({ id: 1, price: 100 } as any);
      jest.spyOn(Profile, 'findByPk').mockResolvedValue(null);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);
  
      await expect(jobService.payJob(1, profile)).rejects.toThrow('Client not found');
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw an error if the job is already paid', async () => {
      const profile = { id: 1, type: ProfileType.Client };
      const job = {
        id: 1,
        price: 100,
        paid: true,
        Contract: { Contractor: { id: 2, balance: 0, save: jest.fn() } },
        save: jest.fn(),
      };
      const client = { id: 1, balance: 200, save: jest.fn() };
    
      jest.spyOn(Job, 'findByPk').mockResolvedValue(job as any);
      jest.spyOn(Profile, 'findByPk').mockResolvedValue(client as any);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);
    
      await expect(jobService.payJob(1, profile)).rejects.toThrow('Job is already paid');
      expect(transaction.rollback).toHaveBeenCalled();
    });
  
    it('should rollback the transaction if saving the client fails', async () => {
      const profile = { id: 1, type: ProfileType.Client };
      const job = {
        id: 1,
        price: 100,
        paid: false,
        Contract: { Contractor: { id: 2, balance: 0, save: jest.fn() } },
        save: jest.fn(),
      };
      const client = { id: 1, balance: 200, save: jest.fn().mockRejectedValue(new Error('Save client error')) };
  
      jest.spyOn(Job, 'findByPk').mockResolvedValue(job as any);
      jest.spyOn(Profile, 'findByPk').mockResolvedValue(client as any);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);
  
      await expect(jobService.payJob(1, profile)).rejects.toThrow('Save client error');
      expect(transaction.rollback).toHaveBeenCalled();
    });
  
    it('should rollback the transaction if saving the job fails', async () => {
      const profile = { id: 1, type: ProfileType.Client };
      const job = {
        id: 1,
        price: 100,
        paid: false,
        Contract: { Contractor: { id: 2, balance: 0, save: jest.fn() } },
        save: jest.fn().mockRejectedValue(new Error('Save job error')),
      };
      const client = { id: 1, balance: 200, save: jest.fn() };
  
      jest.spyOn(Job, 'findByPk').mockResolvedValue(job as any);
      jest.spyOn(Profile, 'findByPk').mockResolvedValue(client as any);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);
  
      await expect(jobService.payJob(1, profile)).rejects.toThrow('Save job error');
      expect(transaction.rollback).toHaveBeenCalled();
    });
  
    it('should rollback the transaction if saving the contractor balance fails', async () => {
      const profile = { id: 1, type: ProfileType.Client };
      const job = {
        id: 1,
        price: 100,
        paid: false,
        Contract: {
          Contractor: { id: 2, balance: 0, save: jest.fn().mockRejectedValue(new Error('Save contractor error')) },
        },
        save: jest.fn(),
      };
      const client = { id: 1, balance: 200, save: jest.fn() };
  
      jest.spyOn(Job, 'findByPk').mockResolvedValue(job as any);
      jest.spyOn(Profile, 'findByPk').mockResolvedValue(client as any);
      const transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
        LOCK: { UPDATE: 'UPDATE' },
      };
      jest.spyOn(db, 'transaction').mockResolvedValue(transaction as any);
  
      await expect(jobService.payJob(1, profile)).rejects.toThrow('Save contractor error');
      expect(transaction.rollback).toHaveBeenCalled();
    });
  });
});
