import { BaseError } from './BaseError';

export class DepositLimitExceededError extends BaseError {
  constructor() {
    super('Deposit amount exceeds 25% of unpaid jobs', 400);
  }
}