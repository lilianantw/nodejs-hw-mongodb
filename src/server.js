//src/server.js

import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

import authRouter from "./routers/auth.js";
import router from "./routers/index.js"; // импортируем роутер
import contactsRouter from "./routers/contacts.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );


//подключаем роуты

  app.use("/auth", authRouter);
   app.use("/contacts", contactsRouter);
  app.use(router);

// Swagger UI
      app.use('/api-docs', swaggerDocs());

// Папка для статических файлов
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Обработчики ошибок
  app.use(notFoundHandler); 
  app.use(errorHandler); 

        app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

