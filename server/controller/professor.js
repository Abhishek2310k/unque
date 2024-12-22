import express from 'express';
import { check_appointments, modify_appointments } from '../services/professor/appointentController.js';
import { login, signUp } from '../services/professor/authController.js';
import { authCheck, validateData } from '../middleware/tokenZod.js';
import { authSchema } from '../schema/authenticationSchema.js';
import { checkAppointmentsSchema, modifyAppointmentsSchema } from '../schema/professorSchema.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       required:
 *         - username
 *         - password
 *     CheckAppointments:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the professor
 *       required:
 *         - username
 *     ModifyAppointments:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the professor
 *         appointment_index:
 *           type: integer
 *           description: The index of the appointment to modify
 *         task:
 *           type: integer
 *           description: The task to perform on the appointment
 *         appointment_id:
 *           type: integer
 *           description: (Optional) The ID of the appointment
 *       required:
 *         - username
 *         - appointment_index
 *         - task
 */

/**
 * @swagger
 * /professor/signup:
 *   post:
 *     summary: Register a new professor
 *     tags: [Professor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error
 */
router.post('/signup', validateData(authSchema, true), signUp);

/**
 * @swagger
 * /professor/login:
 *   post:
 *     summary: Professor login
 *     tags: [Professor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', validateData(authSchema, true), login);

/**
 * @swagger
 * /professor/check_appointments:
 *   get:
 *     summary: Retrieve appointments for a professor
 *     tags: [Professor]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the professor
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get('/check_appointments', authCheck, validateData(checkAppointmentsSchema, false), check_appointments);

/**
 * @swagger
 * /professor/modify_appointments:
 *   put:
 *     summary: Modify an appointment
 *     tags: [Professor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModifyAppointments'
 *     responses:
 *       200:
 *         description: Appointment modified successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */
router.put('/modify_appointments', authCheck, validateData(modifyAppointmentsSchema, true), modify_appointments);

export default router;
