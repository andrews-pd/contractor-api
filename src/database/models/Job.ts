import { Model } from "sequelize";
import sequelize from "sequelize";
import db from ".";
import Contract from "./Contract";

class Job extends Model {
  declare id: number;
  declare description: string;
  declare price: number;
  declare paid: boolean;
  declare paymentDate: Date;
  declare Contract: Contract;
}
Job.init(
  {
    description: {
      type: sequelize.TEXT,
      allowNull: false,
    },
    price: {
      type: sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    paid: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    paymentDate: {
      type: sequelize.DATE,
    },
  },
  {
    sequelize: db,
    modelName: "Job",
    indexes: [
      {
        fields: ["paymentDate"],
      },
    ],
  }
);

export default Job;
