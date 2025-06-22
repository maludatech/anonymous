import { Schema, model, models } from "mongoose";

const passwordResetTokenSchema = new Schema(
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
      index: { expires: "1h" },
    },
  },
  { timestamps: true }
);

// Index for efficient lookup
passwordResetTokenSchema.index({ userId: 1, expiresAt: -1 });

const PasswordResetToken =
  models.PasswordResetToken ||
  model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;
