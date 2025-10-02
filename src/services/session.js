//src/services/session.js

import { SessionCollection } from "../db/models/session.js";

export const registerSession = async(payload) =>{
    return await SessionCollection.create(payload);
};