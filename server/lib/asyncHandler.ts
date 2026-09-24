import type { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 does not catch rejections from async handlers: a failed database call became an
// unhandled promise rejection that killed the whole process (or the serverless invocation).
// Forwarding to next() lets the API error handler answer with a normal 500 instead.
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
