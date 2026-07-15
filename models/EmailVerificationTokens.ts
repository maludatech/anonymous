import { Schema, model, models } from "mongoose";

const emailVerificationTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "24h" },
    },
  },
  { timestamps: true }
);

emailVerificationTokenSchema.index({ userId: 1, expiresAt: -1 });

const EmailVerificationToken =
  models.EmailVerificationToken ||
  model("EmailVerificationToken", emailVerificationTokenSchema);

export default EmailVerificationToken;
