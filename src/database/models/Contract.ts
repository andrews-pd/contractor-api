import { Model } from "sequelize";
import sequelize from "sequelize";
import Job from "./Job";
import db from ".";
import Profile from "./Profile";

class Contract extends Model {
  declare id: number;
  declare terms: string;
  declare status: "new" | "in_progress" | "terminated";
  declare Contractor: Profile;
  declare Client: Profile;
  declare Jobs: Job[];
}
Contract.init(
  {
    terms: {
      type: sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: sequelize.ENUM("new", "in_progress", "terminated"),
    },
  },
  {
    sequelize: db,
    modelName: "Contract",
  }
);

Contract.hasMany(Job);
Job.belongsTo(Contract);

export default Contract;
