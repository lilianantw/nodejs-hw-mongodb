import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import { getAllContacts, getContactsById } from "./services/contacts.js";

import { getEnvVar } from "./utils/getEnvVar.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  // Роут для получения всех контактов
  app.get("/contacts", async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({ data: contacts });
    } catch (err) {
      next(err);
    }
  });

  // Роут для получения контакта по ID
  app.get("/contacts/:contactId", async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactsById(contactId);

      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      res.status(200).json({ data: contact });
    } catch (err) {
      next(err);
    }
  });

  // Обработчик 404
  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
