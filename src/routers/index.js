// src/routers/index.js

import { Router } from "express";
import contactsRouter from "./contacts.js";
import authRouter from "./auth.js";
import sessionRouter from "./session.js";

const router =Router();

router.use("/contacts", contactsRouter );
router.use("/auth", authRouter);
router.use("/session", sessionRouter);

export default router;