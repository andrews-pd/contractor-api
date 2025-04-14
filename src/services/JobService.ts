import { ModelStatic } from 'sequelize';
import { IProfile, ProfileType } from '../interfaces/IProfile';
import { Op } from 'sequelize';
import { ContractStatus } from '../interfaces/IContract';
import Job from '../database/models/Job';
import Contract from '../database/models/Contract';

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
            ...config
          },
        },
      ],
    });
  }
}

export default JobService;
