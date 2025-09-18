//src/services/contacts.js

import { ContactsCollection } from "../db/models/contacts.js";


//получить все контакты 
export const getAllContacts =  async () => {
    const contacts =  await ContactsCollection.find();
    return contacts;
} 
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