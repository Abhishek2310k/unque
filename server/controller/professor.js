import express from 'express';
import { check_appointments, modify_appointments } from '../services/professor/appointentController.js';
import {login,signUp} from '../services/professor/authController.js';
const router = express.Router();
import { authCheck,validateData} from '../middleware/tokenZod.js';
import { authSchema } from '../schema/authenticationSchema.js';
import { checkAppointmentsSchema, modifyAppointmentsSchema} from '../schema/professorSchema.js';

router.post('/signup', 
    validateData(authSchema,true),
    signUp
);

router.post('/login', 
    validateData(authSchema,true),
    login
);

router.get('/check_appointments', 
    authCheck, 
    validateData(checkAppointmentsSchema,false),
    check_appointments
);
router.put('/modify_appointments',
    authCheck, 
    validateData(modifyAppointmentsSchema,true),
    modify_appointments
);

export default router;
