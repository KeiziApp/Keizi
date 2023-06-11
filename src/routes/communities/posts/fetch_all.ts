import Database from "../../../database/Database";
import Route, { MakeResponse } from "../../Route";

class Fetch_All_Posts implements Route {
    public readonly path: string = '/communities/:id/posts';
    public readonly method: string = 'GET';

    public handler = async (req: any, res: any) => {
        const communities = await Database.getInstance().query('SELECT * from communities WHERE id = $1', [req.params.id]);

        // Show a 404 if the community doesn't exist
        if (communities.rows.length === 0) {
            MakeResponse(res, 404, {
                message: 'Community not found'
            });
            return;
        }

        const row = await Database.getInstance().query('SELECT * from posts WHERE community_id = $1', [req.params.id]);
        
        const rows = await Promise.all(row.rows.map(async (post: any) => {
            // get likes and dislikes
            post[7] = await Database.getInstance().query('SELECT * FROM upvotes WHERE post_id = $1', [post[0]]);
            post[8] = await Database.getInstance().query('SELECT * FROM downvotes WHERE post_id = $1', [post[0]]);
            return {
                id: post[0],
                title: post[1],
                content: post[2],
                community_id: post[3],
                cross_posted_domain: post[4],
                user_id: post[4],
                created_at: post[5],
                updated_at: post[6],
                upvotes: post[7].rows.length,
                downvotes: post[8].rows.length
            }
        }));

        MakeResponse(res, 200, rows);
    }
}

export default new Fetch_All_Posts();
