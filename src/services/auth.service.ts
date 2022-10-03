import { User } from 'src/entities/user.entity';
import { getWithUsername, getWithEmail, getWithRole } from './user.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { PayloadToken } from 'src/interfaces/auth.interface';

export const validateUser = async (username: string, password: string) => {
  const userWithUsername = await getWithUsername(username);
  const userWithEmail = await getWithEmail(username);

  if (userWithUsername) {
    const isMatch = await bcrypt.compare(password, userWithUsername.password);
    if (isMatch) {
      return userWithUsername;
    }
  }

  if (userWithEmail) {
    const isMatch = await bcrypt.compare(password, userWithEmail.password);
    if (isMatch) {
      return userWithEmail;
    }
  }

  return null;
};

export const generateJWT = async (user: User) => {
  const userConsult = await getWithRole(user.id, user.role);

  const payload: PayloadToken = {
    role: userConsult!.role,
    sub: userConsult!.id,
  };

  if (userConsult) {
    user.password = 'Not permission';
  }

  return {
    accessToken: jwt.sign(payload, 'khang@2022', { expiresIn: '1h' }),
    user,
  };
};
