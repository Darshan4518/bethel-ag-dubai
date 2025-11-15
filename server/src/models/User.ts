import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  nickname?: string;
  role: 'admin' | 'user';
  mobile?: string;
  alternateMobile?: string;
  address?: string;
  spouse?: string;
  children?: string[];
  nativePlace?: string;
  church?: string;
  avatar?: string;
  pushTokens?: Array<{ token: string; deviceId: string }>;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    nickname: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    mobile: String,
    alternateMobile: String,
    address: String,
    spouse: String,
    children: [String],
    nativePlace: String,
    church: String,
    avatar: String,
    pushTokens: [{
      token: String,
      deviceId: String,
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);


