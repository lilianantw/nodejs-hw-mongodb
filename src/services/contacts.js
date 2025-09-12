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