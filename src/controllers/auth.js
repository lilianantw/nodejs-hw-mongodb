// src/controllers/auth.js
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from "../services/auth.js";

// Установка cookie для refreshToken и sessionId
const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

// Регистрация нового пользователя
export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user, // без пароля
    });
  } catch (err) {
    next(err);
  }
};

// Логин пользователя
export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body); // старые сессии удаляются в сервисе

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: "Successfully logged in a user!",
      data: { accessToken: session.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// Logout пользователя
export const logoutUserController = async (req, res, next) => {
  try {
    const token = req.token; // берем токен из middleware authenticate

    if (token) {
      await logoutUser(token); // удаляем сессию по accessToken
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Обновление сессии по refreshToken
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken: session.accessToken },
    });
  } catch (err) {
    next(err);
  }
};
