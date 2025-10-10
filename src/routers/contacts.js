  //src/routers/contacts.js
 import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactsSchema, updateContactsSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

//  перевірка токена
router.use(authenticate);

// Отримати всі контакти
router.get("/", ctrlWrapper(getContactsController));

// Отримати контакт за ID
router.get("/:contactId", isValidId, ctrlWrapper(getContactsByIdController));

// Створення контакту з фото
router.post(
  "/",
  upload.single("photo"),
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController)
);

//  Часткове оновлення контакту з фото
router.patch(
  "/:contactId",
  isValidId,
  upload.single("photo"),
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController)
);


router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
