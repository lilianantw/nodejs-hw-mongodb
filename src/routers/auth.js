//src/routers/auth.js
import {Router} from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";
import { registerUserController,
         loginUserController,
         logoutUserController,
         refreshUserSessionController,
          requestResetEmailController,
          resetPasswordController,
        } from "../controllers/auth.js";



import { validateBody } from "../middlewares/validateBody.js";

import { authenticate } from "../middlewares/authenticate.js";
// import { createContactsSchema, updateContactsSchema } from "../validation/contacts.js";



const router = Router();
//auth routes
router.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/logout', logoutUserController);
router.post('/refresh', refreshUserSessionController);

//роут для скидання паролю через емейл
router.post("/send-reset-email", validateBody(requestResetEmailSchema),ctrlWrapper(requestResetEmailController) );
     
//роут для зміни пароля
 router.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));



export default router;