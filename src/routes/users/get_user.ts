import Database from "../../database/Database";
import Route, { MakeResponse } from "../Route";

class Get_User implements Route {
    public readonly path: string = '/users/:id';
    public readonly method: string = 'GET';

    public handler = async (req: any, res: any) => {
        const { rows } = await Database.getInstance().query('SELECT id, username, domain, avatar, is_admin, created_at FROM users WHERE id = $1', [req.params.id]);

        if (rows.length === 0) {
            MakeResponse(res, 404, { message: 'User not found' });
            return;
        }

        console.log(rows[0]);

        MakeResponse(res, 200, {
            id: rows[0][0],
            username: rows[0][1],
            domain: rows[0][2],
            avatar: rows[0][3],
            is_admin: rows[0][4],
            created_at: rows[0][5]
        });
    }
}

export default new Get_User();
