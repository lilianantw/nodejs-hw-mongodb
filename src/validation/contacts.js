//src/validation/contacts.js

import Joi from "joi";


export const createContactsSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().valid("work", "home", "personal").default("personal").required(),
});


export const updateContactsSchema = Joi.object({
name: Joi.string(),
phoneNumber: Joi.string(),
email: Joi.string().email(),
isFavourite: Joi.boolean(),
contactType: Joi.string().valid("work", "home", "personal"),
});
