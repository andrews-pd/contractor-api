import { ModelStatic } from 'sequelize';
import Contract from '../database/models/Contract';
import { IProfile, ProfileType } from '../interfaces/IProfile';
import { Op } from 'sequelize';
import { ContractStatus } from '../interfaces/IContract';

class ContractService {
  private contractModel: ModelStatic<Contract> = Contract;
  constructor() {
    this.contractModel = Contract;
  }

  public async getById(id: number, profile: IProfile): Promise<Contract | null> {
    const { id: profileId, type } = profile;
    if (Number(profileId) !== id) {
      throw new Error('Users can only access their respective contracts');
    }

    const config = type === ProfileType.Client ? { ClientId: profileId } : { ContractorId: profileId };

    return await this.contractModel.findOne({ where: { ...config } });
  }

  public async getAll(profile: IProfile): Promise<Contract[] | null> {
    const { id: profileId, type } = profile;

    const config = type === ProfileType.Client ? { ClientId: profileId } : { ContractorId: profileId };

    return await this.contractModel.findAll({
      where: {
        status: {
          [Op.not]: ContractStatus.Terminated,
        },
        ...config,
      },
    });
  }
}

export default ContractService;
