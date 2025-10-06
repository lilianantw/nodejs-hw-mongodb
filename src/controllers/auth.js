// src/controllers/auth.js

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from "../services/auth.js";

// Регистрация нового пользователя
export const registerUserController = async (req, res, next) => {
  try {

    const {name, email, password} = req.body;
    const user = await registerUser({name, email, password});

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user, 
    });
  } catch (err) {
    next(err);
  }
};

// Логин пользователя
export const loginUserController = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const session = await loginUser({email, password}); // старые сессии удаляются в сервисе

     // 🔥 Додай цей рядок:
    console.log('session._id:', session._id);

    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session",
      data: { accessToken: session.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// Обновление сессии по refreshToken
export const refreshUserSessionController = async(req, res, next) =>{
   try{
     const { sessionId, refreshToken } = req.cookies;
   const session = await refreshUsersSession({ sessionId, refreshToken });
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      expiries: session.refreshTokenValidUntil,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
 
    res.status(200).json({
        status: 200,
        message: 'Succesfully refreshed a session',
        data: {
          accessToken: session.accessToken,
        },
    });
      } catch (err) {
    next(err);
  }
};

// Logout пользователя
export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) {
      await logoutUser(sessionId); // ← передаём _id
    }
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


