import Route, { MakeResponse } from "../Route";
import PasswordUtils from "../../utils/PasswordUtils";
import Database from "../../database/Database";

import { config } from "dotenv";
config();

class Login implements Route {
    public readonly path: string = '/auth/register';
    public readonly method: string = 'POST';

    public handler = (req: any, res: any) => {
        const { username, email, password } = req.body;
        const passwordHash = PasswordUtils.makeHash(password);

        Database.getInstance().query('INSERT INTO users (username, domain, email, password) VALUES ($1, $2, $3)', [username, process.env.SERVER_NAME, email, passwordHash]);

        // TODO; Create token to sign in user

        MakeResponse(res, 200, { message: 'User created.' });
    }
}

export default new Login();
