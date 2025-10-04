
// src/db/models/session.js

import { model, Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true, 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SessionCollection = model("Session", sessionSchema);
