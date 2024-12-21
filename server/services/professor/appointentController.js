import respone_setter from "../../utility_fun.js";
import connection from "../../db.js";

export async function modify_appointments(req,res) {
    try {
        const {username,appointment_index,task} = req.body;
        const [rows] = await connection.execute(
            'SELECT apointment FROM professor WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return respone_setter(res, 404, true, 'Professor not found');
        }

        let avail_string = rows[0].apointment;
        if (task) {
            // this is for cancelling the appointment
            avail_string = avail_string.substring(0, appointment_index) + '2' + avail_string.substring(appointment_index + 1);
            await connection.execute(
                'UPDATE professor SET apointment = ? WHERE username = ?',
                [avail_string, username]
            );

            await connection.execute(
                'DELETE FROM appointments_made WHERE id = ?',
                [appointment_id]
            )

            return respone_setter(res,200,false,"appointments_updated");
        }
        else {
            avail_string = avail_string.substring(0, appointment_index) + '0' + avail_string.substring(appointment_index + 1);
            await connection.execute(
                'UPDATE professor SET apointment = ? WHERE username = ?',
                [avail_string, username]
            );
            return respone_setter(res,200,false,"appointments_updated");
        }

    } catch (error) {
        console.log(error);
        return respone_setter(res,500,true,"error while modifying the appointments");
    }
};


export async function check_appointments(req,res) {
    try {
        const { username } = req.query;

        if (!username) {
            return respone_setter(res, 400, true, 'Username is required');
        }

        const [rows] = await connection.query(
            'SELECT prof_username, slot_index FROM appointments_made WHERE prof_username = ?',
            [username]
        );

        return respone_setter(res, 200, false, { appointments: rows });
    } catch (error) {
        console.log(error);
        return respone_setter(res, 500, true, 'Something went wrong while fetching the appointments');
    }
};
