import { BaseEntity } from 'src/shares';
import { Column, Entity } from 'typeorm';

@Entity('verification_otp')
export class VerificationOtp extends BaseEntity {
  @Column()
  email: string;

  @Column()
  otp: string;
}
