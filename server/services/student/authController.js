import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import respone_setter from '../../utility_fun.js';
import connection from '../../db.js';
export async function signUp(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return respone_setter(res, 400, true, 'Username and password are required');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.execute(
            'INSERT INTO student (username, password) VALUES (?, ?)', 
            [username, hashedPassword]
        );

        return respone_setter(res, 201, false, username);
    } catch (err) {
        return respone_setter(res, 500, true, 'An error occurred', err.message);
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        const [rows] = await connection.execute(
            'SELECT * FROM student WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return respone_setter(res, 404, true, 'User does not exist');
        }

        const hashedPassword = rows[0].password;
        const compare = await bcrypt.compare(password, hashedPassword);

        if (compare) {
            const token = jwt.sign({ username }, 'session_secret');
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: "Strict",
            });
            return respone_setter(res, 200, false, 'Login successful');
        }

        return respone_setter(res, 401, true, 'Password incorrect');
    } catch (error) {
        return respone_setter(res, 500, true, 'An error occurred', error.message);
    }
}
