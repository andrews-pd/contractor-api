import { Model } from "sequelize";
import sequelize from "sequelize";
import Job from "./Job";
import db from ".";

class Contract extends Model {
  declare id: number;
  declare terms: string;
  declare status: "new" | "in_progress" | "terminated";
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
