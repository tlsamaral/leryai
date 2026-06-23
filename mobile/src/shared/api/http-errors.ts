export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500
  }

  get isServerError() {
    return this.status >= 500
  }
}
