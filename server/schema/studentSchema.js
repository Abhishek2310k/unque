import {z} from "zod";
// prof_username, student_username, interval_index
export const bookAppointmentSchema = z.object({
    prof_username: z.string(),
    student_username: z.string(),
    interval_index: z.number()
});

export const getAppointmentsSchema = z.object({
    prof_username: z.string()
});

export const checkAppointmentsSchema = z.object({
    username: z.string()
})