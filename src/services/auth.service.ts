import { getByUsername } from './user.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from 'src/entities/user.entity';

dotenv.config({
  path:
    process.env.NODE_ENV !== undefined
      ? `.${process.env.NODE_ENV.trim()}.env`
      : '.env',
});

export const validateUser = async (username: string, password: string) => {
  const userWithUsername = await getByUsername(username);

  if (!userWithUsername) return;
  const isMatch = await bcrypt.compare(password, userWithUsername.password);
  if (!isMatch) return;
  return userWithUsername;
};

export const createToken = (user: User) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET || 'anything',
    {
      expiresIn: 86400,
    }
  );
};
