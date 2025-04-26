import { BaseError } from './BaseError';

export class OnlyClientsCanDepositError extends BaseError {
  constructor() {
    super('Only clients can deposit', 403);
  }
}