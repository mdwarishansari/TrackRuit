import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["email-verification", "password-reset", "login"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create OTP
otpSchema.statics.generateOTP = function (email, type, expiresInMinutes = 10) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return this.create({
    email,
    otp,
    type,
    expiresAt,
  });
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function (email, otp, type) {
  const otpRecord = await this.findOne({
    email,
    otp,
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() },
    attempts: { $lt: 5 },
  });

  if (!otpRecord) {
    return { isValid: false, message: "Invalid or expired OTP" };
  }

  // Increment attempts
  otpRecord.attempts += 1;

  if (otpRecord.attempts >= 5) {
    await otpRecord.save();
    return { isValid: false, message: "Too many failed attempts" };
  }

  // Mark as used if valid
  otpRecord.isUsed = true;
  await otpRecord.save();

  return { isValid: true, message: "OTP verified successfully" };
};

export default mongoose.model("OTP", otpSchema);
