import { Request } from "express";
import Database from "../../../../database/Database";
import SessionUtils from "../../../../utils/SessionUtils";
import Route, { MakeResponse } from "../../../Route";

import { config } from "dotenv";
import AuthenticationUtils from "../../../../utils/AuthenticationUtils";
config();

class Make_Comment implements Route {
    public readonly path: string = '/communities/:community/posts/:post/create';
    public readonly method: string = 'POST';

    public handler = async (req: Request, res: any) => {
        const { content } = req.body;
        const token = req.headers['authorization']
        let user = null;

        // Make sure user is logged in
        if ((user = await AuthenticationUtils.VerifyCredentials(token || "")) == null) {
            MakeResponse(res, 403, { message: "You must be logged in to make a post" });
            return;
        }

        // Make sure there's all fields present in the request
        if (!content) {
            MakeResponse(res, 400, { message: "Missing fields", fields: ["content"].filter((field) => !req.body[field]) });
            return;
        }

        const { rows } = await Database.getInstance().query('SELECT * FROM communities WHERE id = $1', [req.params.community]);

        // Make sure the community exists
        if (rows.length === 0) {
            MakeResponse(res, 404, { message: "Community not found" });
            return;
        }

        // Make sure the post exists
        const { rows: post } = await Database.getInstance().query('SELECT * FROM posts WHERE id = $1', [req.params.post]);
        if (post.length === 0) {
            MakeResponse(res, 404, { message: "Post not found" });
            return;
        }

        // Make comment
        await Database.getInstance().query('INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3)', [content, req.params.post, user[0]]);
        MakeResponse(res, 200, { message: "Successful" });
    }
}

export default new Make_Comment();
