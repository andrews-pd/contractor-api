import { injectable } from 'tsyringe';
import Job from '../database/models/Job';
import AdminRepository from '../repositories/AdminRepository';

@injectable()
class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  public async getBestProfession(start: string, end: string): Promise<Job | null> {
    return await this.adminRepository.getBestProfession(start, end);
  }

  public async getBestClients(start: string, end: string, limit: number) {
    return await this.adminRepository.getBestClients(start, end, limit);
  }
}

export default AdminService;
