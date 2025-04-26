import { BaseError } from './BaseError';

export class InvalidDepositAmountError extends BaseError {
  constructor() {
    super('Deposit amount must be positive', 400);
  }
}