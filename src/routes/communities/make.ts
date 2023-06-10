import { Request } from "express";
import Database from "../../database/Database";
import SessionUtils from "../../utils/SessionUtils";
import Route, { MakeResponse } from "../Route";

import { config } from "dotenv";
config();

class Fetch_All_Communities implements Route {
    public readonly path: string = '/communities/create';
    public readonly method: string = 'POST';

    public handler = async (req: Request, res: any) => {
        const { name, display_name, description } = req.body;
        const token = req.headers['authorization']
        console.log(token)

        // Make sure user is logged in
        if (!token || SessionUtils.GetUserBySession(token) == null) {
            MakeResponse(res, 401, { message: "You must be logged in to create a community" });
            return;
        }

        // Make sure there's all fields present in the request
        if (!name || !display_name || !description) {
            MakeResponse(res, 400, { message: "Missing fields", fields: ["name", "display_name", "description"].filter((field) => !req.body[field]) });
            return;
        }

        const { rows } = await Database.getInstance().query('SELECT * FROM communities WHERE name = $1', [name]);

        if (rows.length > 0) {
            MakeResponse(res, 403, { message: "A community with this name already exists" });
            return;
        }

        Database.getInstance().query('INSERT INTO communities (name, domain, display_name, description) VALUES ($1, $2, $3, $4)', [name, process.env.SERVER_NAME, display_name, description]);
        MakeResponse(res, 200, { message: "Successful" });
    }
}

export default new Fetch_All_Communities();
