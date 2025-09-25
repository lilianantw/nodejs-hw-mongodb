//src/controllers/contacts.js

 import {
     getAllContacts, 
     getContactsById, 
     createContact, 
  updateContact
  } from "../services/contacts.js";
  import { deleteContact } from "../services/contacts.js";
  import { parsePaginationParams } from "../utils/parsePaginationParams.js";
  import { parseSortParams } from "../utils/parseSortParams.js";
  import {parseContactFilterParams} from "../utils/parseFilterParams.js";


 import createError from "http-errors";

// контроллер для получения всех контактов

 export const getContactsController = async (req, res) => {
       const { page, perPage } = parsePaginationParams(req.query);
       const {sortBy, sortOrder} = parseSortParams(req.query);
       const filters = parseContactFilterParams(req.query);

       const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filters
       });

       res.status(200).json({
            "status": 200,
            "message": "Successfully found contacts!",
            "data": contacts
           });
   };




// контроллер получения контакта по ID

   export const getContactsByIdController = async (req, res, next) => {
         const { contactId } = req.params;
      const contact = await getContactsById(contactId);

      if (!contact) {
        throw createError(404,  "Contact not found");
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    }); 
  };
// контроллер создания нового контакта 
  export const createContactController = async(req, res) => {
    const contact = await createContact(req.body);

    res.status(201).json({
    status: 201,
    message:"Successfully created a contact!",
     data: contact	// дані створеного контакту
    });
};
 // контроллер обновления (изменения) контакта 
export const patchContactController = async(req, res) =>{
 const { contactId } = req.params;
  const cleanId = contactId.trim();


  if (!req.body || Object.keys(req.body).length === 0) {
    throw createError(400, "Request body cannot be empty");
  }
    const updatedContact = await updateContact(contactId, req.body);

         if (!updatedContact) {
        throw createError(404,  "Contact not found");
      }

   res.status(200).json({
    status: 200,
    message:"Successfully patched a contact!",
     data: updatedContact,	// оновлені дані контакту
    });
};

//контроллер для удаления контакта

export const deleteContactController = async(req, res) => {
     const { contactId } = req.params;

 const deletedContact = await deleteContact(contactId);

         if (!deletedContact) {
        throw createError(404,  "Contact not found");
      }

   res.status(200).json({
  status: 200,
  message: "Successfully deleted contact!",
  data: deletedContact,
});

};
