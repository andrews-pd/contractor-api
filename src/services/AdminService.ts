import Contract from '../database/models/Contract';
import { Op, fn, col } from "sequelize";
import Profile from '../database/models/Profile';
import Job from '../database/models/Job';

class AdminService {

  public async getBestProfession(start: string, end: string): Promise<Job | null> {
    const topProfession = await Job.findOne({
    attributes: [
      [col("Contract.Contractor.profession"), "profession"],
      [fn("sum", col("price")), "totalEarned"],
    ],
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            as: "Contractor",
            attributes: [],
            where: { type: "contractor" },
          },
        ],
      },
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    group: ["Contract.Contractor.profession"],
    order: [[fn("sum", col("price")), "DESC"]],
    raw: true,
  });

  return topProfession;
  }

  public async getBestClients(start: string, end: string, limit: number) {
    const bestClients = await Job.findAll({
      attributes: [
        [col("Contract.Client.id"), "id"],
        [fn("concat", col("Contract.Client.firstName"), " ", col("Contract.Client.lastName")), "fullName"],
        [fn("sum", col("price")), "totalPaid"],
      ],
      include: [
        {
          model: Contract,
          attributes: [],
          include: [
            {
              model: Profile,
              as: "Client",
              attributes: [],
              where: { type: "client" },
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [start, end],
        },
      },
      group: ["Contract.Client.id"],
      order: [[fn("sum", col("price")), "DESC"]],
      limit,
      raw: true,
    });
  
    return bestClients;
  }

}

export default AdminService;
