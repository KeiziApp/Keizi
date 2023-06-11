import { Request } from "express";
import Database from "../../../database/Database";
import SessionUtils from "../../../utils/SessionUtils";
import Route, { MakeResponse } from "../../Route";

import { config } from "dotenv";
config();

class Upvote_Post implements Route {
    public readonly path: string = '/communities/:id/posts/:post/upvote';
    public readonly method: string = 'POST';

    public handler = async (req: Request, res: any) => {
        const token = req.headers['authorization']
        console.log(token)

        let user = null;

        // Make sure user is logged in
        if (!token || (user = (await SessionUtils.GetUserBySession(token))) == false) {
            MakeResponse(res, 401, { message: "You must be logged in to upvote" });
            return;
        }

        const { rows } = await Database.getInstance().query('SELECT * FROM posts WHERE id = $1', [req.params.post]);

        // Make sure the community exists
        if (rows.length === 0) {
            MakeResponse(res, 404, { message: "Post not found" });
            return;
        }

        // Make sure the user hasn't already upvoted
        const { rows: upvotes } = await Database.getInstance().query('SELECT * FROM upvotes WHERE post_id = $1 AND user_id = $2', [req.params.post, user[0]]);
        if (upvotes.length > 0) {
            MakeResponse(res, 400, { message: "You have already upvoted this post" });
            return;
        }

        // upvote
        Database.getInstance().query('INSERT INTO upvotes (post_id, user_id) VALUES ($1, $2)', [req.params.post, user[0]]);
        MakeResponse(res, 200, { message: "Successful" });
    }
}

export default new Upvote_Post();
