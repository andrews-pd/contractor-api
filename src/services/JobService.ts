import { ModelStatic } from 'sequelize';
import { IProfile, ProfileType } from '../interfaces/IProfile';
import Job from '../database/models/Job';
import Contract from '../database/models/Contract';
import db from '../database/models';
import Profile from '../database/models/Profile';

class JobService {
  private jobModel: ModelStatic<Job> = Job;
  constructor() {
    this.jobModel = Job;
  }

  public async getAllUnpaid(profile: IProfile): Promise<Job[] | null> {
    const { id: profileId, type } = profile;

    const config = type === ProfileType.Client ? { ClientId: profileId } : { ContractorId: profileId };

    return await this.jobModel.findAll({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          where: {
            ...config,
          },
        },
      ],
    });
  }

  public async payJob(jobId: number, profile: IProfile) {
    const transaction = await db.transaction();

    try {
      const job = await this.getJobWithContract(jobId, transaction);
      this.validateJob(job);

      const client = await this.getClientWithLock(profile.id, transaction);
      this.validateClientBalance(client, job.price);

      await this.processPayment(client, job, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async getJobWithContract(jobId: number, transaction: any) {
    const job = await Job.findByPk(jobId, {
      include: [
        {
          model: Contract,
          include: [{ model: Profile, as: 'Contractor' }],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  private validateJob(job: Job) {
    if (job.paid) {
      throw new Error('Job is already paid');
    }
  }

  private async getClientWithLock(profileId: number, transaction: any) {
    const client = await Profile.findByPk(profileId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return client;
  }

  private validateClientBalance(client: Profile, jobPrice: number) {
    if (client.balance < jobPrice) {
      throw new Error('Insufficient funds for the payment.');
    }
  }

  private async processPayment(client: Profile, job: Job, transaction: any) {
    client.balance -= job.price;
    await client.save({ transaction });

    job.Contract.Contractor.balance += job.price;
    await job.Contract.Contractor.save({ transaction });

    job.paid = true;
    job.paymentDate = new Date();
    await job.save({ transaction });
  }
}

export default JobService;
