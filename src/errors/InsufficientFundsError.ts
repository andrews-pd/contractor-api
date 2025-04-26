import { BaseError } from './BaseError';

export class InsufficientFundsError extends BaseError {
  constructor() {
    super('Insufficient funds for the payment.', 400);
  }
}