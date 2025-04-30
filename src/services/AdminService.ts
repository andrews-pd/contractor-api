import { injectable } from 'tsyringe';
import Job from '../database/models/Job';
import AdminRepository from '../repositories/AdminRepository';
import CacheService from '../cache/CacheService';

@injectable()
class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private cacheService: CacheService
  ) {}

  public async getBestProfession(start: string, end: string): Promise<Job | null> {
    const cacheKey = `best-profession:${start}:${end}`;
    const cached = await this.cacheService.get<any>(cacheKey);

    if (cached) return cached;
    
    return await this.adminRepository.getBestProfession(start, end);
  }

  public async getBestClients(start: string, end: string, limit: number) {
    const cacheKey = `best-clients:${start}:${end}`;
    const cached = await this.cacheService.get<any>(cacheKey);

    if (cached) return cached;
    return await this.adminRepository.getBestClients(start, end, limit);
  }
}

export default AdminService;
