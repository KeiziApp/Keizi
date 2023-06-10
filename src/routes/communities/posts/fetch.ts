import Database from "../../../database/Database";
import Route, { MakeResponse } from "../../Route";

class Fetch_All_Posts implements Route {
    public readonly path: string = '/communities/:id/posts/:post';
    public readonly method: string = 'GET';

    public handler = async (req: any, res: any) => {
        const { rows } = await Database.getInstance().query('SELECT * from posts WHERE id = $1', [req.params.post]);

        MakeResponse(res, 200, {
            id: rows[0][0],
            title: rows[0][1],
            content: rows[0][2],
            community_id: rows[0][3],
            cross_posted_domain: rows[0][4],
            user_id: rows[0][4],
            created_at: rows[0][5],
            updated_at: rows[0][6]
        });
    }
}

export default new Fetch_All_Posts();
