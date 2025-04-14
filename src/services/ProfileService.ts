import { ModelStatic } from "sequelize";
import Profile from "../database/models/Profile";

class ProfileService {
  private profileModel: ModelStatic<Profile> = Profile;
  constructor() {
    this.profileModel = Profile;
  }

  public async getById(id: number): Promise<Profile | null> {
    return await this.profileModel.findOne({ where: { id } });
  }
}

export default ProfileService;
