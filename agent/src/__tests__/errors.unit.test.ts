import { describe, expect, it } from 'vitest'
import {
  AgentError,
  BadRequestError,
  SessionNotFoundError,
} from '@/errors.js'

describe('AgentError', () => {
  it('sets message and default statusCode 500', () => {
    const err = new AgentError('something broke')
    expect(err.message).toBe('something broke')
    expect(err.statusCode).toBe(500)
    expect(err.name).toBe('AgentError')
  })

  it('accepts custom statusCode', () => {
    const err = new AgentError('custom', 503)
    expect(err.statusCode).toBe(503)
  })

  it('is an instance of Error', () => {
    expect(new AgentError('x')).toBeInstanceOf(Error)
  })
})

describe('SessionNotFoundError', () => {
  it('statusCode is 404', () => {
    expect(new SessionNotFoundError('abc').statusCode).toBe(404)
  })

  it('message includes the session id', () => {
    expect(new SessionNotFoundError('sess-123').message).toContain('sess-123')
  })

  it('name is SessionNotFoundError', () => {
    expect(new SessionNotFoundError('x').name).toBe('SessionNotFoundError')
  })

  it('is an instance of AgentError', () => {
    expect(new SessionNotFoundError('x')).toBeInstanceOf(AgentError)
  })
})

describe('BadRequestError', () => {
  it('statusCode is 400', () => {
    expect(new BadRequestError('bad input').statusCode).toBe(400)
  })

  it('message matches constructor arg', () => {
    expect(new BadRequestError('userText cannot be empty').message).toBe(
      'userText cannot be empty',
    )
  })

  it('name is BadRequestError', () => {
    expect(new BadRequestError('x').name).toBe('BadRequestError')
  })

  it('is an instance of AgentError', () => {
    expect(new BadRequestError('x')).toBeInstanceOf(AgentError)
  })
})
