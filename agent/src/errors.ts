export class AgentError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
  ) {
    super(message)

    this.name = 'AgentError'
  }
}

export class SessionNotFoundError extends AgentError {
  constructor(id: string) {
    super(`Agent session ${id} not found`, 404)
    this.name = 'SessionNotFoundError'
  }
}

export class BadRequestError extends AgentError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'BadRequestError'
  }
}
