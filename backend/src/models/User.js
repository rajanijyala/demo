const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["candidate", "coach", "placement_officer", "content_administrator"],
      default: "candidate"
    },
    otp: {
      type: String,
      select: false
    },
    otpExpiresAt: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiresAt;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model("User", userSchema);
