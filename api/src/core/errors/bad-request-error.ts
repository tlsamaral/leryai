import { AppError } from './app-error'

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, 'ERR_BAD_REQUEST')
  }
}
