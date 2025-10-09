//src/routers/auth.js
import {Router} from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserSchema, loginUserSchema, requestResetEmailSchema} from "../validation/auth.js";
import { registerUserController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserController,
         logoutUserController,
         refreshUserSessionController,
        requestResetEmailController
 } from "../controllers/auth.js";
 import { resetPasswordSchema } from "../validation/auth.js";
 import { resetPasswordController } from "../controllers/auth.js";

import { authenticate } from "../middlewares/authenticate.js";


const router = Router();

router.post("/register", 
            validateBody(registerUserSchema),
            ctrlWrapper(registerUserController),
         );

         router.post("/login", 
            validateBody(loginUserSchema),
            ctrlWrapper(loginUserController),
         );

         router.post('/logout', logoutUserController);
         router.post('/refresh', refreshUserSessionController);

//роут для скидання паролю через емейл
         router.post("/send-reset-email", validateBody(requestResetEmailSchema),ctrlWrapper(requestResetEmailController) );
     
         //роут для зміни пароля
         router.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

     export default router;
