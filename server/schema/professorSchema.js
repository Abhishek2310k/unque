import {z} from "zod";

export const checkAppointmentsSchema = z.object({
    username: z.string()
})


// username,appointment_index,task,appointment_id
export const modifyAppointmentsSchema = z.object({
    username: z.string(),
    appointment_index: z.number(),
    task: z.number(),
    appointment_id:z.number().optional()
});