// src/middlewares/validateBody.js

import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) =>{
    try{
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    }catch {
    next(createHttpError(400, "Bad request"));
      }
    };