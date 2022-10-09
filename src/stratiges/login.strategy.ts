import { PassportUse } from 'src/utils/passport.use';
import { validateUser } from './../services/auth.service';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';

const validate = async (username: string, password: string, done: any) => {
  const user = await validateUser(username, password);
  if (!user) {
    return done(null, false, { message: 'wrong username or password' });
  }
  return done(null, user);
};

export const loginUser = () => {
  return PassportUse<LocalStrategy, object, VerifyFunction>(
    'login',
    LocalStrategy,
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    validate
  );
};
