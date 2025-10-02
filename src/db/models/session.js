//src/db/models/session.js


import {model, Schema}from "mongoose";

export const sessionSchema = new Schema({
userId:{type: Schema.Types.ObjectId, ref: "users"},
accessToken:{type: String, required: true},
refreshToken:{type: String, required: true},
accessTokenValidUntil:{type: Date, required: true},
refreshTokenValidUntil:{type: Date, required: true},
},
{timestamps: true, versionKey: false},
);


export const SessionCollection = model("Session", sessionSchema);
