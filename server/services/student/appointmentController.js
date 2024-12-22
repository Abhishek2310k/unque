import connection from '../../db.js';
import respone_setter from '../../utility_fun.js';

export async function getAppointments(req, res) {
    try {
        const { prof_username } = req.query;

        if (!prof_username) {
            return respone_setter(res, 400, true, 'prof_username is required');
        }

        const [rows] = await connection.execute(
            'SELECT apointment FROM professor WHERE username = ?',
            [prof_username]
        );

        if (rows.length === 0) {
            return respone_setter(res, 404, true, 'Professor not found');
        }

        return respone_setter(res, 200, false, rows[0].apointment);
    } catch (error) {
        return respone_setter(res, 500, true, 'An error occurred while fetching data');
    }
}

export async function bookAppointment(req, res) {
    try {
        const { prof_username, student_username, interval_index } = req.body;

        const [rows] = await connection.execute(
            'SELECT apointment FROM professor WHERE username = ?',
            [prof_username]
        );

        let orig_string = rows[0].apointment;

        if (orig_string[interval_index] === '2') {
            return respone_setter(res, 400, true, 'Slot canceled! Please try another slot');
        }

        if (orig_string[interval_index] === '1') {
            return respone_setter(res, 400, true, 'Slot is already booked! Please try another one');
        }

        orig_string = orig_string.substring(0, interval_index) + '1' + orig_string.substring(interval_index + 1);
        await connection.execute(
            'UPDATE professor SET apointment = ? WHERE username = ?',
            [orig_string, prof_username]
        );

        await connection.execute(
            'INSERT INTO appointments_made (s_username, prof_username, slot_index) VALUES (?, ?, ?)',
            [student_username, prof_username, interval_index]
        );

        return respone_setter(res, 201, false, 'Appointment booked');
    } catch (error) {
        return respone_setter(res, 500, true, 'Something went wrong while booking the appointment');
    }
}

export async function checkAppointments(req, res) {
    try {
        const { username } = req.query;

        if (!username) {
            return respone_setter(res, 400, true, 'Username is required');
        }

        const [rows] = await connection.query(
            'SELECT prof_username, slot_index, id FROM appointments_made WHERE s_username = ?',
            [username]
        );

        return respone_setter(res, 200, false, { appointments: rows });
    } catch (error) {
        return respone_setter(res, 500, true, 'Something went wrong while fetching the appointments');
    }
}
