import Database from "../../../database/Database";
import Route, { MakeResponse } from "../../Route";

class Fetch_All_Posts implements Route {
    public readonly path: string = '/communities/:id/posts/:post';
    public readonly method: string = 'GET';

    public handler = async (req: any, res: any) => {
        const { rows } = await Database.getInstance().query('SELECT * from posts WHERE id = $1', [req.params.post]);

        if (rows.length === 0) {
            MakeResponse(res, 404, {
                message: 'Post not found'
            });
            return;
        }

        // get comments limit to 15 sort by newest
        const comments = await Database.getInstance().query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC LIMIT 15', [req.params.post]);

        MakeResponse(res, 200, {
            id: rows[0][0],
            title: rows[0][1],
            content: rows[0][2],
            community_id: rows[0][3],
            cross_posted_domain: rows[0][4],
            user_id: rows[0][4],
            created_at: rows[0][5],
            updated_at: rows[0][6],
            comments: await Promise.all(comments.rows.map(async (comment: any) => {
                // propagate user data from user_id
                const { rows } = await Database.getInstance().query('SELECT id, username, domain, avatar FROM users WHERE id = $1', [comment[4]]);

                return {
                    id: comment[0],
                    content: comment[1],
                    post_id: comment[2],
                    linked_comment_id: comment[3],
                    user: {
                        id: rows[0][0],
                        username: rows[0][1],
                        domain: rows[0][2],
                        avatar: rows[0][3]
                    },
                    created_at: comment[5],
                    updated_at: comment[6]
                }
            }))
        });
    }
}

export default new Fetch_All_Posts();
