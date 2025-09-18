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


const router = Router ();

router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", ctrlWrapper(getContactsByIdController ));
router.post("/", ctrlWrapper(createContactController));
router.patch("/:contactId", ctrlWrapper(patchContactController));
router.delete("/:contactId", ctrlWrapper(deleteContactController));

export default router;