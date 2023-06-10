import { Request } from "express";
import Database from "../../../database/Database";
import SessionUtils from "../../../utils/SessionUtils";
import Route, { MakeResponse } from "../../Route";

import { config } from "dotenv";
config();

class Make_Post implements Route {
    public readonly path: string = '/communities/:id/posts/create';
    public readonly method: string = 'POST';

    public handler = async (req: Request, res: any) => {
        const { title, content } = req.body;
        const token = req.headers['authorization']
        console.log(token)

        let user = null;

        // Make sure user is logged in
        if (!token || (user = (await SessionUtils.GetUserBySession(token))) == false) {
            MakeResponse(res, 401, { message: "You must be logged in to make a post" });
            return;
        }

        // Make sure there's all fields present in the request
        if (!title || !content) {
            MakeResponse(res, 400, { message: "Missing fields", fields: ["title", "content"].filter((field) => !req.body[field]) });
            return;
        }

        const { rows } = await Database.getInstance().query('SELECT * FROM communities WHERE id = $1', [req.params.id]);

        // Make sure the community exists
        if (rows.length === 0) {
            MakeResponse(res, 404, { message: "Community not found" });
            return;
        }

        console.log(user)

        // Make post
        await Database.getInstance().query('INSERT INTO posts (title, content, community_id, user_id) VALUES ($1, $2, $3, $4)', [title, content, req.params.id, user[0]]);
        MakeResponse(res, 200, { message: "Successful" });
    }
}

export default new Make_Post();
