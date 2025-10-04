// src/services/auth.js
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
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
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    isValid: true, // ✅ добавлено
  });
};

export const logoutUser = async (accessToken) => {
  // Инвалидация сессии, чтобы токен больше не был действительным
  await SessionCollection.findOneAndUpdate(
    { accessToken },
    { isValid: false } // ✅ теперь logout реально инвалидирует токен
  );
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    isValid: true, // ✅ добавлено
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
