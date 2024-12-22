import jwt from "jsonwebtoken";
import {ZodError} from "zod";
import respone_setter from "../utility_fun.js";

export function authCheck (req,res,next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log('token is not sent');
            next();
        }
        const validation = jwt.verify(token,'session_secret');
        console.log(validation);
        next();
    }catch (err) {
        respone_setter(res,500,err,"some error with the token verification");
    }
}

export function validateData(schema,bodyFlag) {
    return (req,res,next) => {
        try {
            if (bodyFlag)
                schema.parse(req.body);
            else schema.parse(req.query);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))

                return respone_setter(res,400,true,errorMessages);
            }
            else {
                return respone_setter(res,500,true,err);
            }
        }
    }
}