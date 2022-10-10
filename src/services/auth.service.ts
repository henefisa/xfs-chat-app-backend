import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';

export const createToken = (user: User) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET || 'anything',
    {
      expiresIn: 86400,
    }
  );
};
