import { OtpDto } from 'src/dto/auth/otp.dto';
import { getOneOrThrow } from './user.service';
import { config } from 'dotenv';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { EUserStatus } from 'src/interfaces/user.interface';
import Database from 'src/configs/Database';
import { User } from 'src/entities/user.entity';

config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const map = new Map<string, string>();

const userRepository = Database.instance
  .getDataSource('default')
  .getRepository(User);

export const sendEmail = async (email: string) => {
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

  map.set(otp, email);
};

export const checkOtp = async (dto: OtpDto) => {
  if (map.get(dto.otp) !== dto.email) {
    return false;
  }

  map.delete(dto.otp);

  const user = await getOneOrThrow({ where: { email: dto.email } });

  user.status = EUserStatus.Inactive;

  await userRepository.save(user);

  return true;
};
