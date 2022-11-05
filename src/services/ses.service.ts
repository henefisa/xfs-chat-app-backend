import { getOneOrThrow } from './user.service';
import { config } from 'dotenv';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { EUserStatus } from 'src/interfaces/user.interface';
import Database from 'src/configs/Database';
import { User } from 'src/entities/user.entity';

config();

let otp: string;
let emailAddress: string;

const userRepository = Database.instance
  .getDataSource('default')
  .getRepository(User);

export const sendEmail = async (email: string) => {
  otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mainOptions = {
    from: 'RVK Chat App',
    to: email,
    subject: 'RVK Chat app OTP Verification',
    text: ' Hello welcome RVK Chat App, your OTP Verification ',
    html: `<p> Hello welcome RVK Chat App, your OTP Verification <b>${otp}</b> </p> `,
  };

  transporter.sendMail(mainOptions);
  emailAddress = email;
};

export const checkOtp = async (code: string) => {
  if (code !== otp) {
    return false;
  }

  const user = await getOneOrThrow({ where: { email: emailAddress } });

  user.status = EUserStatus.Inactive;

  await userRepository.save(user);

  return true;
};
