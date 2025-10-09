// src/services/auth.js
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import {SMTP} from "../constants/index.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from '../utils/sendMail.js';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";  
import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from "../db/models/user.js";


export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, "User not found");

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  // Удаляем старые сессии пользователя
  await SessionCollection.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),  // refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    isValid: true, // 
  });
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Unauthorized');
  }

  const session = await SessionCollection.findOne({refreshToken});

  if (!session) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ _id: session._id });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    isValid: true, 
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) throw createHttpError(401, 'Session token expired');

  const newSession = createSession();

  // Удаляем старую сессию
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};


export const requestResetToken = async(email) => {
const user = await UsersCollection.findOne({email});

if(!user){
  throw createHttpError(404, 'User not found!');
}

const resetToken =jwt.sign(
  {sub: user._id, email},
  getEnvVar("JWT_SECRET"),
  {expiresIn: "5m"},
);

try{
await sendEmail({
  from: getEnvVar(SMTP.SMTP_FROM),
  to: email,
  subject: "Reset your password",
  html: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
});
}catch {
  throw createHttpError(500, 'Failed to send the email, please try again later.');
}
};

export async function resetPassword(token, password) {
  try{
 const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

const hashedPassword =  await bcrypt.hash(password, 10);
await UsersCollection.updateOne(
  {_id: decoded.sub}, 
  {password: hashedPassword}
);
    // Удаляем все сессии пользователя после смены пароля
    await SessionCollection.deleteMany({ userId: decoded.sub });

  }catch(error){
    if(error.name === "TokenExpiredError"){
        throw createHttpError.Unauthorized(401, "User not found!"  )
    }  
  

  if(error.name === "JsonWebTokenError"){
      throw createHttpError.Unauthorized(401, "Token is expired or invalid."  )
  }
}
};
