// src/routers/session.js

import { Router } from "express";
import {ctrlWrapper} from "../utils/ctrlWrapper.js";
import { sessionSchema } from "../validation/session.js";
import {SessionController } from "../controllers/session.js";
import { validateBody } from "../middlewares/validateBody.js";

const router = Router();

router.post(
    "/session",
    validateBody(sessionSchema),
    ctrlWrapper(SessionController),
);

export default  router;