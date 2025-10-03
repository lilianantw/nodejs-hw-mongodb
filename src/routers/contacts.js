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

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", isValidId, ctrlWrapper(getContactsByIdController));
router.post("/", validateBody(createContactsSchema), ctrlWrapper(createContactController));
router.patch("/:contactId", isValidId, validateBody(updateContactsSchema), ctrlWrapper(patchContactController));
router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
