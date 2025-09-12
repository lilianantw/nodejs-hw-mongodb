import { ContactsCollection } from "../db/models/contacts";

export const getAllContacts =  async () => {
    const contacts =  await ContactsCollection.find();
    return contacts;
} 

export const getContactsById = async () => {
    const contact =  await ContactsCollection.findById(contactId);
    return contact;
};