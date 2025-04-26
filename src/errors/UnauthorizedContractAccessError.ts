import { BaseError } from './BaseError';

export class UnauthorizedContractAccessError extends BaseError {
  constructor() {
    super('Users can only access their respective contracts', 403);
  }
}