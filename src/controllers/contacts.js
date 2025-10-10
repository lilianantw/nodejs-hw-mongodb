//src/controllers/contacts.js

import { getAllContacts } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import createError from "http-errors";
import { ContactsCollection } from "../db/models/contacts.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';



export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = {...req.filter, userId: req.user._id};


  // добавлен фильтр по пользователю
  const userFilter = { userId: req.user._id, ...filters };

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters: userFilter
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

export const createContactController = async (req, res, next) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const newContactData = {
    ...req.body,
    userId: req.user._id,
  };

  if (photoUrl) {
    newContactData.photo = photoUrl;
  }

  const contact = await ContactsCollection.create(newContactData);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

//********************
  export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  if (!req.body || Object.keys(req.body).length === 0) {
    return next(createError(400, "Request body cannot be empty"));
  }

  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updatedData = { ...req.body };
  if (photoUrl) updatedData.photo = photoUrl;

  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: req.user._id },
    updatedData,
    { new: true }
  );

  if (!result) {
    return next(createError(404, "Contact not found"));
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result,
  });
};

//****************** 

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


