import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { UnauthorizedException } from 'src/exceptions';
import { getOne } from 'src/services/user.service';

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET || 'anything',
};

export default new Strategy(opts, async (payload, done) => {
	try {
		const user = await getOne({ where: { id: payload.id } });

		if (user) {
			return done(null, user);
		}

		return done(new UnauthorizedException(), false);
	} catch (error) {
		return done(error, false);
	}
});
