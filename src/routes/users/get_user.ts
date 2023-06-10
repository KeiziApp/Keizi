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

        MakeResponse(res, 200, rows[0]);
    }
}

export default new Get_User();
