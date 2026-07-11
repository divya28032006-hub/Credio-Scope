import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    refreshTokenHash: {
      type: String,
      select: false
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastLoggedDate: { type: String, default: null }
    },
    reminderTime: {
      // 24hr "HH:MM" set during signup - when the daily "did you spend cash today?" email fires
      type: String,
      default: '20:00',
      match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    reminderEnabled: {
      type: Boolean,
      default: true
    },
    lastReminderSentDate: {
      type: String,
      default: null,
      select: false
    },
    resetPasswordTokenHash: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);