//src/controllers/contacts.js

import { getAllContacts } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseContactFilterParams } from "../utils/parseFilterParams.js";
import createError from "http-errors";
import { ContactsCollection } from "../db/models/contacts.js";

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = parseContactFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters
  });

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await ContactsCollection.findOne({ _id: contactId, userId: req.user._id });

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await ContactsCollection.create({ ...req.body, userId: req.user._id });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError(400, "Request body cannot be empty");
  }

  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: req.user._id },
    req.body,
    { new: true }
  );

  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updatedContact
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await ContactsCollection.findOneAndDelete({ _id: contactId, userId: req.user._id });

  if (!deletedContact) {
    throw createError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully deleted contact!",
    data: deletedContact
  });
};
