import { BaseError } from './BaseError';

export class ClientNotFoundError extends BaseError {
  constructor() {
    super('Client not found', 404);
  }
}