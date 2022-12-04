import { RefreshTokenDto } from 'src/dto/auth/refresh-token.dto';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { IAuthentication } from 'src/interfaces/auth.interface';
import { getOneOrThrow } from './user.service';
import redis from 'src/configs/Redis';
import { LogoutDto } from 'src/dto/auth/logout.dto';
import { UnauthorizedException } from 'src/exceptions';
import { getRefreshTokenKey } from 'src/utils/redis';

export const createToken = (user: User) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET || 'anything',
    {
      expiresIn: 86400,
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

  const newRefreshToken = createRefreshToken(user);
  redis.set(getRefreshTokenKey(user.id) + user.id, newRefreshToken);

  return {
    access_token: createToken(user),
    refresh_token: createRefreshToken(user),
  };
};

export const logout = async (dto: LogoutDto) => {
  const payload = jwt.verify(
    dto.refreshToken,
    process.env.SECRET || 'anything'
  ) as IAuthentication;

  const user = await getOneOrThrow({ where: { id: payload.id } });
  const savedToken = await redis.get(getRefreshTokenKey(user.id));

  if (savedToken !== dto.refreshToken) {
    throw new UnauthorizedException();
  }

  redis.del(getRefreshTokenKey(user.id));

  return;
};
