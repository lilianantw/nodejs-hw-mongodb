// src/controllers/auth.js
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from "../services/auth.js";
import {   requestResetToken , resetPassword } from "../services/auth.js";

// Регистрация нового пользователя
export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });

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
    const { email, password } = req.body;
    const session = await loginUser({ email, password });

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
      message: "Successfully logged in",
      data: { accessToken: session.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// Обновление сессии по refreshToken
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    const session = await refreshUsersSession({ sessionId, refreshToken });

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
      message: 'Successfully refreshed a session',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};


export const logoutUserController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    await logoutUser(refreshToken);

    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// export async function requestPasswordResetController(req, res) {
//   await requestPasswordReset(req.body.email);
//   res.json({status: 200});
//   }


// контролер, який буде обробляти запит на зміну пароля
export const requestResetEmailController = async (req, res) =>
{
await requestResetToken(req.body.email);
res.json({
message: "Reset password email was successfully sent",
status: 200,
data: {},
});
};
//конспект
// export const resetPasswordController = async (req, res) => {
//   await resetPassword(req.body);
//   res.json({
//     message: "Password was successfully reset!",
//     status: 200,
//     data: {},
//   });
// };

//лекция
export async function  resetPasswordController (req, res) {
  await resetPassword(req.body.token, req.body.password);
  res.json({
       status: 200,
       message: "Password has been successfully reset.",
       data: {}});
};
