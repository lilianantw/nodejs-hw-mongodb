//src/controllers/session.js

import { registerSession} from "../services/session.js";


export const SessionController = async(req, res) =>{
    const session = await registerSession(req.body);

    res.status(201).json({
        status: 201,
        message: 'Session is ok!',
        data: session,
    });
};
