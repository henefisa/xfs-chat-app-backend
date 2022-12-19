import { getResetPasswordKey } from '../utils/redis';
import otpGenerator from 'otp-generator';
import redis from 'src/configs/Redis';
import { transporter } from './send-otp.service';
import * as userService from 'src/services/user.service';
import { NotFoundException } from 'src/exceptions';

export const sendLink = async (email: string, host: string) => {
  const user = await userService.getOne({ where: { email } });

  if (!user) {
    throw new NotFoundException('user');
  }

  const code = otpGenerator.generate(10, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const mainOptions = {
    from: 'RVK Chat App',
    to: email,
    subject: 'RVK Chat app reset password',
    text: ' Hello welcome RVK Chat App, your link reset password ',
    html: `<p> Hello welcome RVK Chat App, your link reset password <b> ${host}/reset-password/${user.id}?code=${code}</b> </p> `,
  };

  transporter.sendMail(mainOptions);

  redis.set(getResetPasswordKey(user.id), code);
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
