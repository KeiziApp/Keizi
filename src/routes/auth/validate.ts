import Database from "../../database/Database";
import Logger from "../../logging/Logger";
import Route, { MakeResponse } from "../Route";
import { config } from "dotenv";

config();

class Validate implements Route {
    public readonly path: string = '/auth/validate';
    public readonly method: string = 'POST';

    public handler = async (req: any, res: any) => {
        const { user, nonce } = req.body;
        Logger.info(`Validating user ${user} with nonce ${nonce}`);
        const { rows } = await Database.getInstance().query('SELECT * FROM nonces WHERE nonce = $1', [nonce]);

        if (rows.length === 0) {
            MakeResponse(res, 403, { message: 'Nonce is invalid.' });
            return;
        }

        // Validate target domain
        if (rows[0][3] !== (req.headers.origin || "localhost")) {
            MakeResponse(res, 403, { message: 'Nonce is invalid.' });
            return;
        }

        // Validate user relates to nonce
        if (rows[0][1] !== user) {
            MakeResponse(res, 403, { message: 'Nonce is invalid.' });
            return;
        }

        // Get user from the database stripping password and other sensitive information
        const { rows: userRows } = await Database.getInstance().query('SELECT id, username, domain, avatar, created_at FROM users WHERE username = $1', [rows[0][1]]);

        MakeResponse(res, 200, { user: {
            id: userRows[0][0],
            username: userRows[0][1],
            domain: userRows[0][2],
            avatar: userRows[0][3],
            created_at: userRows[0][4]
        } });
    }
}

export default new Validate();
