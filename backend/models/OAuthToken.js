import mongoose from "mongoose";

const oAuthTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["google"],
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    scope: [String],
    tokenType: {
      type: String,
      default: "Bearer",
    },
  },
  {
    timestamps: true,
  }
);

// Index for user and provider
oAuthTokenSchema.index({ user: 1, provider: 1 });

// Check if token is expired
oAuthTokenSchema.methods.isExpired = function () {
  return Date.now() >= this.expiresAt;
};

export default mongoose.model("OAuthToken", oAuthTokenSchema);
