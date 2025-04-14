import { ModelStatic } from "sequelize";
import Profile from "../database/models/Profile";
import md5 from "md5";
import { sign } from "../jwt/jwt";

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
      return { message: "Invalid email or password" };
    }

    const { id, email, type } = profile;
    const token = sign({ id, email, type });

    return { id, email, token };
  }
}

export default ProfileService;
