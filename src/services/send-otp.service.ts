import redis from 'src/configs/Redis';
import { config } from 'dotenv';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { EUserStatus } from 'src/interfaces/user.interface';
import Database from 'src/configs/Database';
import { User } from 'src/entities/user.entity';
import { getOneOrThrow } from './user.service';

config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const userRepository = Database.instance
  .getDataSource('default')
  .getRepository(User);

export const sendOtp = async (email: string) => {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const mainOptions = {
    from: 'RVK Chat App',
    to: email,
    subject: 'RVK Chat app OTP Verification',
    text: ' Hello welcome RVK Chat App, your OTP Verification ',
    html: `<p> Hello welcome RVK Chat App, your OTP Verification <b>${otp}</b> </p> `,
  };

  transporter.sendMail(mainOptions);

  redis.set(email, otp);
  redis.expire(email, 60);
};

export const checkOtp = async (email: string, code: string) => {
  const savedOtp = await redis.get(email);

  if (code !== savedOtp) {
    return false;
  }

  redis.del(email);

  const user = await getOneOrThrow({ where: { email: email } });

  user.status = EUserStatus.Active;

  await userRepository.save(user);

  return true;
};
