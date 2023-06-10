import Database from "../database/Database"

async function GetUserBySession (token: string) {
    const { rows } = await Database.getInstance().query('SELECT * FROM sessions WHERE token = $1', [token]);

    if (rows.length === 0) {
        return false;
    }

    const { rows: users } = await Database.getInstance().query('SELECT * FROM users WHERE id = $1', [rows[0][2]]);
    
    return users[0];
}

export default {
    GetUserBySession
}