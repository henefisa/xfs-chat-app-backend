import { RefreshTokenDto } from 'src/dto/auth/refresh-token.dto';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { IAuthentication } from 'src/interfaces/auth.interface';
import { getOneOrThrow } from './user.service';

export const createToken = (user: User) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET || 'anything',
    {
      expiresIn: 300,
    }
  );
};

export const createRefreshToken = (user: User) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET || 'anything',
    {
      expiresIn: 86400 * 30,
    }
  );
};

export const refreshToken = async (dto: RefreshTokenDto) => {
  const payload = <IAuthentication>(
    jwt.verify(dto.refreshToken, process.env.SECRET || 'anything')
  );

  const user = await getOneOrThrow({ where: { id: payload.id } });

  if (payload.exp > 86400) {
    return {
      access_token: createToken(user),
      refresh_token: dto.refreshToken,
    };
  }

  return {
    access_token: createToken(user),
    refresh_token: createRefreshToken(user),
  };
};
