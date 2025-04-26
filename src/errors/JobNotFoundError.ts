import { BaseError } from './BaseError';

export class JobNotFoundError extends BaseError {
  constructor() {
    super('Job not found', 404);
  }
}