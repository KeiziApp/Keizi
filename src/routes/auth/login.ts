import Database from "../../database/Database";
import Route from "../Route";

class Login implements Route {
    public readonly path: string = '/auth/login';
    public readonly method: string = 'POST';

    public handler = (req: any, res: any) => {
        res.json({ message: 'Login' });

        Database.getInstance().query('SELECT * FROM users');
    }
}

export default new Login();
