import { BaseError } from './BaseError';

export class NoJobsInProgressError extends BaseError {
  constructor() {
    super('No jobs in progress', 404);
  }
}