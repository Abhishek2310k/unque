import express from "express";
import { login, signUp } from "../services/student/authController.js";
import { bookAppointment, checkAppointments, getAppointments } from "../services/student/appointmentController.js";
import { authCheck, validateData } from "../middleware/tokenZod.js";
import { bookAppointmentSchema, checkAppointmentsSchema, getAppointmentsSchema } from "../schema/studentSchema.js";
import { authSchema } from "../schema/authenticationSchema.js";

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
 *     BookAppointment:
 *       type: object
 *       properties:
 *         prof_username:
 *           type: string
 *           description: The professor's username
 *         student_username:
 *           type: string
 *           description: The student's username
 *         interval_index:
 *           type: integer
 *           description: The index of the time interval for the appointment
 *       required:
 *         - prof_username
 *         - student_username
 *         - interval_index
 */

/**
 * @swagger
 * /student/signup:
 *   post:
 *     summary: Register a new student
 *     tags: [Student]
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
 * /student/login:
 *   post:
 *     summary: Student login
 *     tags: [Student]
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
 * /student/get_appointments:
 *   get:
 *     summary: Retrieve appointments for a professor
 *     tags: [Student]
 *     parameters:
 *       - in: query
 *         name: prof_username
 *         schema:
 *           type: string
 *         required: true
 *         description: The professor's username
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get('/get_appointments', authCheck, validateData(getAppointmentsSchema, false), getAppointments);

/**
 * @swagger
 * /student/book_appointment:
 *   put:
 *     summary: Book an appointment with a professor
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookAppointment'
 *     responses:
 *       200:
 *         description: Appointment booked successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */
router.put('/book_appointment', authCheck, validateData(bookAppointmentSchema, true), bookAppointment);

/**
 * @swagger
 * /student/check_appointments:
 *   get:
 *     summary: Check appointment status for a user
 *     tags: [Student]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: Appointment status retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/check_appointments', authCheck, validateData(checkAppointmentsSchema, false), checkAppointments);

export default router;
