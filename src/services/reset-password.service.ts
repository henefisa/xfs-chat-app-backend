import { getResetPasswordKey } from '../utils/redis';
import otpGenerator from 'otp-generator';
import redis from 'src/configs/Redis';
import { transporter } from './send-otp.service';
import * as userService from 'src/services/user.service';
import { NotFoundException } from 'src/exceptions';

const getOptions = (email: string, host: string, id: string, code: string) => {
  return {
    from: 'RVK Chat App',
    to: email,
    subject: 'RVK Chat app reset password',
    text: ' Hello welcome RVK Chat App, your link reset password ',
    html: `<p> Hello welcome RVK Chat App, your link reset password <b> ${host}/reset-password/${id}?code=${code}</b> </p> `,
  };
};

export const sendLink = async (email: string, host: string) => {
  const user = await userService.getOneOrThrow({ where: { email } });

  const code = otpGenerator.generate(20, { specialChars: false });

  const mainOptions = getOptions(email, host, user.id, code);

  transporter.sendMail(mainOptions);

  const key = getResetPasswordKey(user.id);

  redis.set(key, code);
  redis.expire(key, 10 * 60);
};

export const resetPassword = async (
  id: string,
  code: string,
  password: string
) => {
  const savedCode = await redis.get(getResetPasswordKey(id));
  if (code !== savedCode) {
    throw new NotFoundException('user');
  }
  return userService.updatePasswordUser({ password }, id);
};
