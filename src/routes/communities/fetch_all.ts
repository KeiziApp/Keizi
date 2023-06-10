import Database from "../../database/Database";
import Route, { MakeResponse } from "../Route";

class Fetch_All_Communities implements Route {
    public readonly path: string = '/communities';
    public readonly method: string = 'GET';

    public handler = async (req: any, res: any) => {
        const row = await Database.getInstance().query('SELECT * FROM communities');
        MakeResponse(res, 200, row.rows);
    }
}

export default new Fetch_All_Communities();
