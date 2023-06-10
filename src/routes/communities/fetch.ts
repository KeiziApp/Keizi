import Database from "../../database/Database";
import Route, { MakeResponse } from "../Route";

class Fetch_Community implements Route {
    public readonly path: string = '/communities/:id';
    public readonly method: string = 'GET';

    public handler = async (req: any, res: any) => {
        const { rows } = await Database.getInstance().query('SELECT id, name, description, icon, created_at, updated_at FROM communities WHERE id = $1', [req.params.id]);

        if (rows.length === 0) {
            MakeResponse(res, 404, { message: 'Community not found' });
            return;
        }

        MakeResponse(res, 200, {
            id: rows[0][0],
            name: rows[0][1],
            description: rows[0][2],
            icon: rows[0][3],
            created_at: rows[0][4],
            updated_at: rows[0][5]
        });
    }
}

export default new Fetch_Community();
