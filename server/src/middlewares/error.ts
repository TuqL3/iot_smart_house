import { Request, Response, NextFunction } from 'express'
import { components } from '~/schemas'

export type ErrorDto = components['schemas']['ErrorModel']

export function errorHandler(err: any, req: Request, res: Response<ErrorDto>, next: NextFunction) {
  console.error(err.stack)
  res.status(err.status || 500).send({ message: err.message || 'Internal Server Error' })
}
