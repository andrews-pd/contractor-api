import { ModelStatic } from "sequelize";
import Contract from "../database/models/Contract";

class ContractService {
  private contractModel: ModelStatic<Contract> = Contract;
  constructor() {
    this.contractModel = Contract;
  }

  public async getById(id: number): Promise<Contract | null> {
    return await this.contractModel.findOne({ where: { id } });
  }
}

export default ContractService;
