import Database from "../../database/Database";
import SessionUtils from "../../utils/SessionUtils";
import Route, { MakeResponse } from "../Route";
import { config } from "dotenv";
import crypto from "crypto";

config();

class MakeNonce implements Route {
    public readonly path: string = '/auth/nonce';
    public readonly method: string = 'POST';

    public handler = async (req: any, res: any) => {
        const token = req.headers['authorization']
        let user = null;

        // Make sure user is logged in
        if (!token || (user = (await SessionUtils.GetUserBySession(token))) == null) {
            MakeResponse(res, 401, { message: "You must be logged in to generate a nonce" });
            return;
        }

        const nonce = crypto.randomBytes(16).toString('hex');

        Database.getInstance().query('INSERT INTO nonces (user_target, target_domain, nonce) VALUES ($1, $2, $3)', [user[1], process.env.SERVER_NAME, nonce]);  

        MakeResponse(res, 200, { token: nonce });
    }
}

export default new MakeNonce();
