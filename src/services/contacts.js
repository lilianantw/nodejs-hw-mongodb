//src/services/contacts.js

import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";


//получить все контакты 
export const getAllContacts =  async ({
    page = 1,
     perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = "_id",
    filters = {},
    }) => {
    const limit  = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find(filters);
    const contactsCount = await ContactsCollection.countDocuments(filters);
    
  
    const contacts =  await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({[sortBy]: sortOrder})
    .exec();

    const paginationData = calculatePaginationData(contactsCount, perPage, page);
    
    
    return{
        data: contacts,
        ...paginationData,
    };
};

//получить контакт по ID
export const getContactsById = async (contactId, userId)=> {
    const contact =  await ContactsCollection.findOne({_id: contactId, userId});
    return contact;
};


// создать новый контакт

export  const createContact = async(data, userId) => {
    const contact = await ContactsCollection.create({...data, userId});
    return contact;
};

//обновить контакт

export const updateContact = async (
  contactId,
  data,
  userId,
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

//контроллер удаления контакта
export const deleteContact = async (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};