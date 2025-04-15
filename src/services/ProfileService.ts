import { ModelStatic } from 'sequelize';
import Profile from '../database/models/Profile';
import md5 from 'md5';
import { sign } from '../jwt/jwt';
import Contract from '../database/models/Contract';
import Job from '../database/models/Job';
import { ContractStatus } from '../interfaces/IContract';
import db from '../database/models';

class ProfileService {
  private profileModel: ModelStatic<Profile> = Profile;
  constructor() {
    this.profileModel = Profile;
  }

  public async getById(id: number): Promise<Profile | null> {
    return await this.profileModel.findOne({ where: { id } });
  }

  public async login(_email: string, password: string) {
    const hasPassword = md5(password);
    const profile = await this.profileModel.findOne({
      where: {
        email: _email,
        password: hasPassword,
      },
    });

    if (!profile) {
      return { message: 'Invalid email or password' };
    }

    const { id, email, type } = profile;
    const token = sign({ id, email, type });

    return { id, email, token };
  }

  public async deposit(userId: number, amount: number) {
    const transaction = await db.transaction();

    try {
      const client = await this.findClient(userId, transaction);
      this.validateDepositAmount(amount);

      const jobs = await this.getUnpaidJobs(userId, transaction);
      const totalJobPrice = jobs.reduce((acc, job) => acc + job.price, 0);

      this.validateDepositLimit(amount, totalJobPrice);

      const newBalance = Number(client.balance) + Number(amount);
      client.balance = newBalance;

      await client.save({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async findClient(userId: number, transaction: any) {
    const client = await this.profileModel.findOne({
      where: { id: userId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!client) throw new Error('Client not found');
    if (client.type !== 'client') throw new Error('Only clients can deposit');

    return client;
  }

  private validateDepositAmount(amount: number) {
    if (!amount || amount < 0) {
      throw new Error('Deposit amount must be positive');
    }
  }

  private async getUnpaidJobs(userId: number, transaction: any) {
    const jobs = await Job.findAll({
      where: { paid: false },
      include: [
        {
          model: Contract,
          where: {
            ClientId: userId,
            status: ContractStatus.InProgress,
          },
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!jobs || jobs.length === 0) {
      throw new Error('No jobs in progress');
    }

    return jobs;
  }

  private validateDepositLimit(amount: number, totalJobPrice: number) {
    if (amount > totalJobPrice * 0.25) {
      throw new Error('Deposit amount exceeds 25% of unpaid jobs');
    }
  }
}

export default ProfileService;
