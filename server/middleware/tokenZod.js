import jwt from "jsonwebtoken";
import {ZodError} from "zod";
import respone_setter from "../utility_fun.js";

export function authCheck (req,res,next) {
    const token = req.headers.authorization;
    if (!token) {
        console.log('token is not sent');
        next();
    }
    const validation = jwt.verify(token,'session_secret');
    console.log(validation);
    next();
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