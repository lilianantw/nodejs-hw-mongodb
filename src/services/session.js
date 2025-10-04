//src/services/session.js

import { SessionCollection } from "../db/models/session.js";

// Создание новой сессии
export const registerSession = async (payload) => {
  return await SessionCollection.create({
    ...payload,
    isValid: true, // ✅ добавлено для всех новых сессий
  });
};

// Logout: помечаем сессию недействительной
export const invalidateSession = async (accessToken) => {
  return await SessionCollection.findOneAndUpdate(
    { accessToken },
    { isValid: false }, // ✅ теперь logout помечает сессию как недействительную
    { new: true }
  );
};
