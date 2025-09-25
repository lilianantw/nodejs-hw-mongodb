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
    const contactsCount = await ContactsCollection.find(filters).countDocuments();
    
  
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
export const getContactsById = async (contactId) => {
    const contact =  await ContactsCollection.findById(contactId);
    return contact;
};


// создать новый контакт

export  const createContact = async(data) => {
    const contact = await ContactsCollection.create(data);
    return contact;
};

//обновить контакт

export const updateContact = async (contactId, data) => {
    const allowedFields = ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType'];
    const filteredData = {};
allowedFields.forEach(field => {
    if (data[field] !== undefined) {
        filteredData[field] = data[field];
    }
});

    const contact = await ContactsCollection.findByIdAndUpdate(contactId, filteredData, { new: true });
    return contact;
};

//контроллер удаления контакта
export const deleteContact = async(contactId) =>{
       const contact = await ContactsCollection.findByIdAndDelete(contactId);
    return contact;
}