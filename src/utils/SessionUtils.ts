import Database from "../database/Database"

type User = {
    id: string,
    username: string,
    domain: string,
    password: string,
    avatar: string,
    email: string,
}

async function GetUserBySession (token: string): Promise<any> {
    const { rows } = await Database.getInstance().query('SELECT * FROM sessions WHERE token = $1', [token]);

    if (rows.length === 0) {
        return null;
    }

    const { rows: users } = await Database.getInstance().query('SELECT * FROM users WHERE id = $1', [rows[0][1]]);

    return users[0];
}

export default {
    GetUserBySession
}