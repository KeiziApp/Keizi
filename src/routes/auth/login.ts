import Database from "../../database/Database";
import PasswordUtils from "../../utils/PasswordUtils";
import Route, { MakeResponse } from "../Route";
import { randomBytes } from "crypto";

class Login implements Route {
    public readonly path: string = '/auth/login';
    public readonly method: string = 'POST';

    public handler = async (req: any, res: any) => {
        const { rows } = await Database.getInstance().query('SELECT * FROM users WHERE username = $1', [req.body.username]);

        // Display error if user is not found or password is incorrect
        if (rows.length === 0 || !PasswordUtils.compareHash(req.body.password, String(rows[0][3]))) {
            MakeResponse(res, 403, { message: 'Username or password is invalid.' });
            return;
        }

        // Create token with crypto
        const token = randomBytes(64).toString('hex');

        // Save session
        await Database.getInstance().query('INSERT INTO sessions (token, user_id, ip, device) VALUES ($1, $2, $3, $4)', [token, rows[0][0], req.ip, req.headers['user-agent']]);

        MakeResponse(res, 200, { token: token });
        Database.getInstance().query('SELECT * FROM users');
    }
}

export default new Login();
