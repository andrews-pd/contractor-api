import { BaseError } from './BaseError';

export class JobAlreadyPaidError extends BaseError {
  constructor() {
    super('Job is already paid', 400);
  }
}