//errorHandler.js
//src/middlewares/errorHandler.js

// import {HttpError} from "http-errors";

export const  errorHandler = (err, req, res, next )=> {
res.status(500).json({
    status: 500,
		message: "Something went wrong",
		data:  	err.message,// конкретне повідомлення про помилку, отримане з об'єкта помилки
});
};