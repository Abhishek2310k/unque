import express from "express";
import { login, signUp } from "../services/student/authController.js";
import { bookAppointment,checkAppointments,getAppointments } from "../services/student/appointmentController.js";
// Sign up
const router = express.Router();
import { authCheck, validateData } from "../middleware/tokenZod.js";
import { bookAppointmentSchema,checkAppointmentsSchema,getAppointmentsSchema } from "../schema/studentSchema.js";
import { authSchema } from "../schema/authenticationSchema.js";

router.post('/signup', 
    signUp,
    validateData(authSchema,true)
);

router.post('/login', 
    validateData(authSchema,true),
    login
);

router.get('/get_appointments', 
    authCheck, 
    validateData(getAppointmentsSchema,false),
    getAppointments
);

router.put('/book_appointment', 
    authCheck,
    validateData(bookAppointmentSchema,true),
    bookAppointment
);

router.get('/check_appointments', 
    authCheck, 
    validateData(checkAppointmentsSchema,false),
    checkAppointments);

export default router;