import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UnauthorizedException } from 'src/exceptions';

export default function requireAuthMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	return passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err) return next(err);
		if (!user) {
			next(new UnauthorizedException());
		}

		req.user = user;
		next();
	})(req, res, next);
}
