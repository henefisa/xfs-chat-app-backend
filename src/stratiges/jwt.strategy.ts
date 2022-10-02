import { PayloadToken } from 'src/interfaces/auth.interface';
import { Strategy as JwtStr, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportUse } from 'src/utils/passport.use';

const validate = (payload: PayloadToken, done: any) => {
  return done(null, payload);
};

export const jwtUse = () => {
  return PassportUse<
    JwtStr,
    StrategyOptions,
    (payload: PayloadToken, done: any) => Promise<PayloadToken>
  >(
    'jwt',
    JwtStr,
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'khang@2022',
      ignoreExpiration: false,
    },
    validate
  );
};
