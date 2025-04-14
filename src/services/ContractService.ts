import { ModelStatic } from 'sequelize';
import Contract from '../database/models/Contract';
import IProfile from '../interfaces/IProfile';

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

    const config = type === 'client' ? { where: { ClientId: id } } : { where: { ContractorId: id } };

    return await this.contractModel.findOne({ ...config });
  }
}

export default ContractService;
