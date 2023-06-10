import Database from "../../database/Database";
import Route, { MakeResponse } from "../Route";

class Fetch_All_Communities implements Route {
    public readonly path: string = '/communities';
    public readonly method: string = 'GET';

    public handler = async (req: any, res: any) => {
        const row = await Database.getInstance().query('SELECT id, name, description, icon, created_at, updated_at FROM communities');
        
        const rows = row.rows.map((community: any) => {
            return {
                id: community[0],
                name: community[1],
                description: community[2],
                icon: community[3],
                created_at: community[4],
                updated_at: community[5]
            }
        });

        MakeResponse(res, 200, rows);
    }
}

export default new Fetch_All_Communities();
