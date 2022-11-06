import { NotFoundException } from './../exceptions/not-found.exception';
import { OtpDto } from 'src/dto/auth/otp.dto';
import { config } from 'dotenv';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { EUserStatus } from 'src/interfaces/user.interface';
import Database from 'src/configs/Database';
import { User } from 'src/entities/user.entity';
import { VerificationOtp } from 'src/entities/verification-otp.entity';
import { FindOneOptions } from 'typeorm';
import { getOneOrThrow } from './user.service';

config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const otpRepository = Database.instance
  .getDataSource('default')
  .getRepository(VerificationOtp);

const userRepository = Database.instance
  .getDataSource('default')
  .getRepository(User);

export const getOne = async (options: FindOneOptions<VerificationOtp>) => {
  return otpRepository.findOne(options);
};

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

  const verification = new VerificationOtp();

  const object = { otp, email };

  Object.assign(verification, object);

  await otpRepository.save(verification);
};

export const checkOtp = async (dto: OtpDto) => {
  const otp = await getOne({ where: { email: dto.email } });

  if (!otp) {
    throw new NotFoundException('email');
  }

  if (dto.otp !== otp.otp) {
    return false;
  }

  otpRepository.delete(otp.id);

  const user = await getOneOrThrow({ where: { email: dto.email } });

  user.status = EUserStatus.Activate;

  await userRepository.save(user);

  return true;
};
