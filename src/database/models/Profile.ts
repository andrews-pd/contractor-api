import { Model } from "sequelize";
import sequelize from "sequelize";
import Contract from "./Contract";
import db from ".";

class Profile extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare profession: string;
  declare balance: number;
  declare type: "client" | "contractor";
}
Profile.init(
  {
    firstName: {
      type: sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: sequelize.STRING,
      allowNull: false,
    },
    profession: {
      type: sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: sequelize.DECIMAL(12, 2),
    },
    type: {
      type: sequelize.ENUM("client", "contractor"),
    },
  },
  {
    sequelize: db,
    modelName: "Profile",
  }
);

Profile.hasMany(Contract, { as: "Contractor", foreignKey: "ContractorId" });
Contract.belongsTo(Profile, { as: "Contractor" });
Profile.hasMany(Contract, { as: "Client", foreignKey: "ClientId" });
Contract.belongsTo(Profile, { as: "Client" });

export default Profile;
